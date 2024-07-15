import warnings
import requests
import os
import time
import traceback
import datetime
import sched
import re
import logging
import mysql.connector
import paramiko
from dotenv import load_dotenv
from config import database

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s: %(message)s"
)
file_handler = logging.FileHandler("/issues.log")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s: %(message)s"))
logging.getLogger().addHandler(file_handler)

load_dotenv()
env = os.getenv("ENVIRONMENT")

if env == "production":
    api_env = "10.224.116.14"
else:
    api_env = "localhost"


def database_connection():
    try:
        mydb = mysql.connector.connect(
            host=database[env]["DB_HOST"],
            user=database[env]["DB_USER"],
            password=database[env]["DB_PASSWORD"],
            database=database[env]["DB_DATABASE"],
        )
        return mydb

    except Exception as e:
        logging.error("Error al conectarse a la base de datos")
        logging.error(traceback.format_exc())
        logging.error(e)


def define_ups_status():
    try:
        logging.info("Iniciando actualizando del estado de UPS para cada dispositivo")
        # Obtenemos los datos actualizados de los Dispositivos y UPS de la API DevNet
        devices = get_api_devices_data()
        ups_list = get_api_ups_data()
        
        if devices == None or ups_list == None:
            raise ValueError("Error al obtener la información de la API")
        


        for device in devices:
            device["ups_status"] = 0 # Inicializamos la llave 'ups_status'
            if ".lundinmining.local" in device["cisco_device_name"]: # Eliminamos el dominio lundin para la comparativa de nombres
                device["cisco_device_name"] = device["cisco_device_name"].replace(".lundinmining.local", "")
                
            name_switch = device["cisco_device_name"] # Obtenemos el nombre del SW sin el dominio lundin

            for ups in ups_list:
                name_ups = ups["name"]
                if name_ups.upper() == f"{name_switch.upper()}-APC": # Comparamos el nombre de la UPS con el nombre del SW del Dispositivo
                    device["ups_status"] = ups["status_ups"] # Asignamos el estado de la UPS al dispositivo
                    
        # Actualizamos el `Estado UPS` de cada dispositivo en la BD
        mydb = database_connection()
        cursor = mydb.cursor()      
        for device in devices:
            query = f"UPDATE dcs.devices SET ups_status = '{device['ups_status']}' WHERE host = '{device['host']}'"
            cursor.execute(query)
            mydb.commit()

        cursor.close()
        logging.info("Se ha actualizado el estado de las UPS correctamente")

    except Exception as e:
        logging.error(f"Hubo un error en la funcion `define_ups_status`: {e}")
        return None


def get_api_ups_data():
    # * Realiza la peticion a la API DevNet para obtener informacion de las UPS
    try:
        API_UPS = os.getenv("API_UPS").format(env=api_env)
        data_ups = requests.get(API_UPS, verify=False).json()
        return data_ups
    
    except Exception as e:
        logging.error("Error al obtener la informacion de las UPS desde la API")
        logging.error(traceback.format_exc())
        logging.error("Error detallado:")
        logging.error(e)
        return None


def get_api_devices_data():
    # * Realiza la peticion a la API DevNet para obtener informacion de los dispositivos

    try:
        API_DEVICES = os.getenv("API_DEVICES").format(env=api_env)
        data_devices = requests.get(API_DEVICES, verify=False).json()
        return data_devices
    
    except Exception as e:
        logging.error("Error al obtener la informacion de los DISPOSITIVOS desde la API")
        logging.error(traceback.format_exc())
        logging.error("Error detallado:")
        logging.error(e)
        return None


define_ups_status()
