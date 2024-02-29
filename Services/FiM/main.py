import requests
import warnings
import os
import datetime
import time
import calendar
import mysql.connector
import logging
import traceback
import sched
from dotenv import load_dotenv
from reset_base import reset_base
from save_register import save_down_register, update_status_base


warnings.filterwarnings("ignore", message="Unverified HTTPS request")

logging.basicConfig(level=logging.INFO, format="%(message)s")
file_handler = logging.FileHandler("issues.log")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter("%(message)s"))
logging.getLogger().addHandler(file_handler)

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

            # Actualizamos estado de la base en la BD
            for sensor in sensors:
                # print(sensor)
                if "portsensor" in sensor["tags"]:
                    base["base_status"] = sensor["status"]
                    update_status_base(base)

            # Reiniciamos la FIM y guardamos registro en caso de ser Down
            for sensor in sensors:
                if "portsensor" in sensor["tags"] and sensor["status"] != "Up":
                    logging.info(f"Reiniciando {base['name']}")
                    logging.info(sensor["status"])
                    reset_base(ip_base)
                    save_down_register(base)
                    
    except Exception as e:
        logging.error(f"Error en la funcion principal - {base['name']}")
        logging.error(traceback.format_exc())
        logging.error(e)


# def bucle(scheduler):
#     getData()
#     scheduler.enter(3600, 1, bucle, (scheduler,))


# if __name__ == "__main__":
#     s = sched.scheduler(time.time, time.sleep)
#     s.enter(0, 1, bucle, (s,))
#     s.run()

check_fim()