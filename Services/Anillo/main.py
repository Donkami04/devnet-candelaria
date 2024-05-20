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
from config import database
from dotenv import load_dotenv


warnings.filterwarnings("ignore", message="Unverified HTTPS request")

logging.basicConfig(level=logging.INFO, format="%(message)s")
file_handler = logging.FileHandler("issues.log")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter("%(message)s"))
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


def status_interfaces():

    try:
        mydb = database_connection()
        cursor = mydb.cursor()
        query = "SELECT * FROM data_anillo"
        cursor.execute(query)

        column_names = [column[0] for column in cursor.description]

        # Convertir los resultados a una lista de diccionarios
        data_anillo = []
        for row in cursor:
            row_dict = {}
            for i in range(len(column_names)):
                row_dict[column_names[i]] = row[i]
            data_anillo.append(row_dict)
            
        data_interfaces = get_data_interfaces(data_anillo) 
        for interface in data_interfaces:
            prtg_id = interface["objid"]
            status = interface["status"]
            query = (f"UPDATE dcs.anillo SET status = '{status}' WHERE prtg_id = '{prtg_id}'")
            cursor.execute(query)
            mydb.commit()
            
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)

        cursor.execute(
            f"UPDATE dcs.fechas_consultas_anillo SET `ultima_consulta` = '{fecha_y_hora}', estado = 'OK' WHERE `id` = 1"
        )
        mydb.commit()
        cursor.close()
        logging.info("Terminado")
                    
    except Exception as e:
        logging.error(f"Error en la funcion principal")
        logging.error(traceback.format_exc())
        logging.error(e)
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)

        cursor.execute(
            f"UPDATE dcs.fechas_consultas_anillo SET `ultima_consulta` = '{fecha_y_hora}', estado = 'ERROR' WHERE `id` = 1"
        )
        mydb.commit()
        
        
def get_data_interfaces(data_anillo):
    # Se obtienen los ID de cada Nodo del Anillo
    # Despues para cada Nodo se consultan el grupo de interfaces relacionado
    # Y se almacena cada interfaz en la lista `data_interfaces`
    try:
        data_interfaces = [] 
        for element in data_anillo:
            ip_node = element['ip']
            logging.info(ip_node)
            get_id_url = os.getenv("URL_PRTG_GET_ID_WITH_IP").format(ip=ip_node)
            response_get_id_url = requests.get(get_id_url, verify=False).json()
            if response_get_id_url["devices"] == []:
                break
            
            id_node = response_get_id_url["devices"][0]
            id_node = id_node['objid']
            url_interfaces = os.getenv("URL_PRTG_GET_STATUS_INTERFACES").format(id_sensor=id_node)
            response_interfaces = requests.get(url_interfaces, verify=False).json()
            interfaces = response_interfaces.get("sensors")
            for interface in interfaces:
                data_interfaces.append(interface)
        

        return data_interfaces


    except Exception as e:
        logging.error(f"Error - Funcion get_data_interfaces")
        logging.error(e)
        logging.error(traceback.format_exc())



def bucle(scheduler):
    status_interfaces()
    scheduler.enter(300, 1, bucle, (scheduler,))


if __name__ == "__main__":
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()
