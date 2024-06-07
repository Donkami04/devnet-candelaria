import os
import logging
import mysql.connector
import traceback
import datetime
from dotenv import load_dotenv
from config import database

logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")
file_handler = logging.FileHandler("issues.log")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(
    logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
)
logging.getLogger().addHandler(file_handler)

load_dotenv()
env = os.getenv("ENVIRONMENT")


def database_connection():
    try:
        if env == "local":
            mydb = mysql.connector.connect(
                host=database["local"]["DB_HOST"],
                user=database["local"]["DB_USER"],
                password=database["local"]["DB_PASSWORD"],
                database=database["local"]["DB_DATABASE"],
            )

        else:
            mydb = mysql.connector.connect(
                host=database["production"]["DB_HOST"],
                user=database["production"]["DB_USER"],
                password=database["production"]["DB_PASSWORD"],
                database=database["production"]["DB_DATABASE"],
            )
        return mydb

    except Exception as e:
        logging.error("Error al conectarse a la base de datos")
        logging.error(traceback.format_exc())
        logging.error(e)
        
def save_down_register(data):
    # Guardar en una tabla las fechas en las que la base fim estuvo down
    mydb = database_connection()
    cursor = mydb.cursor()
    
    base_name = data["name"]
    base_ip = data["ip"]
    
    now = datetime.datetime.now()
    fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
    fecha_y_hora = str(fecha_y_hora)
    
    query_down = "INSERT INTO dcs.dates_down_fimbase (base_name, base_ip, date) VALUES (%s, %s, %s)"
    value_down = (base_name, base_ip, fecha_y_hora)
    cursor.execute(query_down, value_down)
    mydb.commit()
    cursor.close()

def update_status_base(data):
    # Actualiza el estado de la base en la tabla fim_base sin escribir lineas nuevas
    mydb = database_connection()
    cursor = mydb.cursor()

    base_ip = data["ip"]
    base_status = data["base_status"]
    
    query_update = (f"UPDATE dcs.fim_base SET status = '{base_status}', error = '{data['error']}' WHERE base_ip = '{base_ip}'")

    cursor.execute(query_update)
    mydb.commit()
    cursor.close()