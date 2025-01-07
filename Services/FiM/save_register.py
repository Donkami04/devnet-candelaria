import os
import logging
import mysql.connector
import traceback
import datetime
from dotenv import load_dotenv
from config import database
import logger_config
from db_connections import devnet_connection

load_dotenv()
env = os.getenv("ENVIRONMENT")


def save_down_register(data):
    # Guardar en una tabla las fechas en las que la base fim estuvo down
    mydb = devnet_connection()
    cursor = mydb.cursor()

    base_name = data["name"]
    base_ip = data["ip"]

    now = datetime.datetime.now()
    fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
    fecha_y_hora = str(fecha_y_hora)

    query_down = "INSERT INTO devnet.dates_down_fimbase (base_name, base_ip, date) VALUES (%s, %s, %s)"
    value_down = (base_name, base_ip, fecha_y_hora)
    cursor.execute(query_down, value_down)
    mydb.commit()
    cursor.close()


def update_status_base(data):
    # Actualiza el estado de la base en la tabla fim_base sin escribir lineas nuevas
    mydb = devnet_connection()
    cursor = mydb.cursor()

    base_ip = data["ip"]
    base_status = data["base_status"]
    mssg = data["mssg"]

    query_update = f"UPDATE devnet.fim_base SET status = '{base_status}', error = '{mssg}' WHERE base_ip = '{base_ip}'"

    cursor.execute(query_update)
    mydb.commit()
    cursor.close()
