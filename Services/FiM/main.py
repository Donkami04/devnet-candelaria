import requests
import os
import datetime
import time
import logging
import traceback
import sched
import logger_config
from dotenv import load_dotenv
from reset_base import reset_base
from save_register import save_down_register, update_status_base
from db_update_devnet import datetime_register
from db_connections import devnet_connection


load_dotenv()
env = os.getenv("ENVIRONMENT")


def check_fim():

    data = [
        {"name": "Base RAP11", "ip": "10.224.89.10"},
        {"name": "Base Carro FIM1", "ip": "10.224.89.11"},
        {"name": "Base Mirador", "ip": "10.224.89.12"},
        {"name": "Base Carro FIM2", "ip": "10.224.89.13"},
    ]

    try:
        for base in data:
            ip_base = base["ip"]
            logging.info(base["name"])
            # Obtenemos ID de PRTG
            url_objid = os.getenv("URL_PRTG_GET_ID").format(ip=ip_base)
            response_objid = requests.get(url_objid, verify=False).json()
            objid = response_objid.get("devices")[0].get("objid")

            # Consultamos estado de PRTG con el ID obtenido
            url_data_sensor = os.getenv("URL_PRTG_GET_DATA").format(id_sensor=objid)
            response_data_sensor = requests.get(url_data_sensor, verify=False).json()
            sensors = response_data_sensor.get("sensors")

            for sensor in sensors:
                if "Servicio Web" in sensor["sensor"]:
                    base["base_status"] = sensor["status"]
                    base["mssg"] = (
                        "No se ha ejecutado un reboot de la maquina en la ultima consulta"
                    )
                    if "Down" in sensor["status"]:
                        result, mssg = reset_base(ip_base)
                        base["mssg"] = mssg
                        logging.info(
                            f'Resultado de reiniciar la base {base["name"]}: {result}'
                        )
                        save_down_register(base)

                    update_status_base(base)

        datetime_register(system_name="base_fim", status="OK")
        logging.info("Ciclo finalizado con Exito!")

    except Exception as e:
        logging.error(f"Error en la funcion principal - {base['name']}")
        logging.error(traceback.format_exc())
        logging.error(e)
        datetime_register(system_name="base_fim", status="ERROR")


def bucle(scheduler):
    check_fim()
    scheduler.enter(300, 1, bucle, (scheduler,))


if __name__ == "__main__":
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()
