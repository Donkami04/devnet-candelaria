import time
import traceback
import sched
import logging
import logger_config
from dotenv import load_dotenv
from ups import define_ups_status
from db_get_data import get_data
from api_cctv import get_cctv_data, set_cctv_status
from api_prtg import get_prtg_data
from api_cisco import get_cisco_data
from db_insert_historic import save_historic_data
from db_update_devnet import update_devnet_data, datetime_register
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_devices_block(devices, cctv_data):
    """
    Procesa un bloque de dispositivos actualizando su información con datos de las APIs de PRTG y Cisco,
    y actualiza el estado de CCTV si corresponde. También determina el estado de las UPS.

    Args:
        devices (list of dict): Lista de diccionarios que representan los dispositivos a procesar.
        cctv_data (dict): Datos actuales de CCTV.

    Returns:
        list of dict: Lista de dispositivos actualizados con la información de las APIs y el estado de las UPS.
    """
    final_data = []
    for device in devices:
        ip = device["host"]
        type = device["type"]
        red = device["red"]

        logging.info(f"Actualizando dispositivo {ip}")

        prtg_data = get_prtg_data(ip)
        device.update(prtg_data)

        cisco_data = get_cisco_data(red, ip)
        device.update(cisco_data)

        cctv_status = {"cctv_enabled": "N/A", "cctv_valid": "N/A"}
        if type == "Camara" or type == "Cámara":
            cctv_status = set_cctv_status(ip, cctv_data)
        device.update(cctv_status)

        device["ups_status"] = define_ups_status(device["cisco_device_name"])

        final_data.append(device)

    return final_data

def get_devices_data():
    """
    Obtiene y procesa la información actual de los dispositivos y servidores CCTV, dividiéndolos en bloques
    para su procesamiento concurrente. Actualiza la base de datos DevNet y guarda los datos históricos.

    Este proceso se ejecuta en un bucle para repetirse cada 5 minutos, y maneja errores registrando información
    detallada en caso de fallos.
    """
    try:
        load_dotenv()

        devices = get_data(table_name="devices")
        cctv_data = get_cctv_data()

        bloques = [devices[:250], devices[250:500], devices[500:750], devices[750:]]

        final_data = []

        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(process_devices_block, bloque, cctv_data) for bloque in bloques]

            for future in as_completed(futures):
                final_data.extend(future.result())

        devnet_bd_response = update_devnet_data(final_data)
        historic_bd_response = save_historic_data(final_data)

        if devnet_bd_response and historic_bd_response:
            datetime_register(system_name="devices", status="OK")
        else:
            datetime_register(system_name="devices", status="ERROR")

        logging.info("Ciclo finalizado con éxito!")

    except Exception as e:
        datetime_register(system_name="devices", status="ERROR")
        logging.error(traceback.format_exc())
        logging.error(e)

def bucle(scheduler):
    """
    Función que ejecuta el ciclo de actualización de dispositivos y programa su próxima ejecución en 5 minutos.

    Args:
        scheduler (sched.scheduler): Instancia del programador para gestionar las ejecuciones periódicas.
    """
    get_devices_data()
    scheduler.enter(300, 1, bucle, (scheduler,))

if __name__ == "__main__":
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()
