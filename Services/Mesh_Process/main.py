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
from mesh_data import get_mesh_process_data
from check_mac import check_mac
from status_prtg import status_prtg


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s: %(message)s"
)
file_handler = logging.FileHandler("issues.log")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s: %(message)s"))
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


def main():
    try:
        mydb = database_connection()
        cursor = mydb.cursor()
        query = "SELECT * FROM dcs.mesh_process"
        cursor.execute(query)

        # Convertimos los datos Antiguos en una lista de diccionarios
        column_names = [column[0] for column in cursor.description]
        last_data = []
        for row in cursor:
            row_dict = {}
            for i in range(len(column_names)):
                row_dict[column_names[i]] = row[i]
            last_data.append(row_dict)

        # Obtenemos los datos actuales de la controladora 
        current_data = get_mesh_process_data()
        # print(f"de la base de datos: {last_data}")
        # print(f"de la controladora: {current_data}")

        # #! db_data_test
        # last_data = [
        #     {
        #         "id": 1,
        #         "ubication": "Camion 201",
        #         "device": "Cisco AP",
        #         "client": "10.117.115.111",
        #         "last_mac": "B",
        #         "current_mac": "C",
        #         "note": "No data",
        #         "last_change_date": "No data",
        #         "status": "ok",
        #     },
        #     {
        #         "id": 2,
        #         "ubication": "Camion 201",
        #         "device": "Cisco RO",
        #         "client": "10.117.116.201",
        #         "last_mac": "B",
        #         "current_mac": "C",
        #         "note": "No data",
        #         "last_change_date": "No data",
        #         "status": "ok",
        #     },
        #     {
        #         "id": 3,
        #         "ubication": "Camion 201",
        #         "device": "Dispatch",
        #         "client": "10.117.123.201",
        #         "last_mac": "B",
        #         "current_mac": "Not Found",
        #         "note": "No data",
        #         "last_change_date": "No data",
        #         "status": "ok",
        #     },
        # ]

        # #! controladora_data_test
        # current_data = [
        #     {"ip": "10.117.115.201", "mac": "C"},
        #     {"ip": "10.117.116.201", "mac": "B"},
        #     {"ip": "10.117.123.2199", "mac": "B"},
        # ]

        # Si no hay datos desde la maquina manejamos esto como un error
        if current_data == []:
            return "a"  #! Manejar el caso en que no lleguen datos

        # Actualizamos el Mac Anterior con el valor del Mac Actual solo si
        # la Mac actual de la ultima consulta y la mac actual de la consulta mas reciente son diferentes
        for last in last_data:
            for current in current_data:
                if (
                    last["client"] == current["ip"]
                    and last["current_mac"] != current["mac"]
                ):

                    query_last_mac = f"UPDATE dcs.mesh_process SET last_mac = '{last['current_mac']}' WHERE client = '{last['client']}'"
                    cursor.execute(query_last_mac)
                    mydb.commit()

                    now = datetime.datetime.now()
                    fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
                    fecha_y_hora = str(fecha_y_hora)
                    query_current_mac = f"UPDATE dcs.mesh_process SET current_mac = '{current['mac']}', last_change_date = '{fecha_y_hora}' WHERE client = '{current['ip']}'"
                    cursor.execute(query_current_mac)
                    mydb.commit()
                    break

        """
        Definir si en la salida del comando se encuentra la IP o no,
        En caso de no encontrar la IP la mac actual sera Not Found
        La mac anterior tendra el valor de la mac actual si esta es distinta de not found
        """
        ips = [data["ip"] for data in current_data]

        # Validar si hay coincidencias entre las listas
        for data in last_data:
            if data["client"] in ips:
                data["is_currently"] = "Found"
            else:
                data["is_currently"] = "Not Found"

        for last in last_data:
            if (
                last["is_currently"] == "Not Found"
                and last["current_mac"] != "Not Found"
            ):

                query_last_mac = f"UPDATE dcs.mesh_process SET last_mac = '{last['current_mac']}' WHERE client = '{last['client']}'"
                cursor.execute(query_last_mac)
                mydb.commit()

                now = datetime.datetime.now()
                fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
                fecha_y_hora = str(fecha_y_hora)
                query_current_mac = f"UPDATE dcs.mesh_process SET current_mac = 'Not Found', last_change_date = '{fecha_y_hora}' WHERE client = '{last['client']}'"
                cursor.execute(query_current_mac)
                mydb.commit()
                break

        # Funcion para validar si una mac se repite o no
        check_mac()
        
        # Funcion para actualizar el estado y id de PRTG
        status_prtg()

        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)

        cursor.execute(
            f"UPDATE dcs.fechas_consultas_mesh_process SET `ultima_consulta` = '{fecha_y_hora}' WHERE `id` = 1"
        )
        mydb.commit()
        cursor.close()
        logging.info("Ciclo Terminado")

    except Exception as e:
        logging.error("Error en funcion Main")
        logging.error(e)
        logging.error(traceback.format_exc())
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(
            f"UPDATE dcs.fechas_consultas_mesh_process SET `ultima_consulta` = '{fecha_y_hora}', `estado` = 'ERROR' WHERE `id` = 1"
        )
        mydb.commit()
        cursor.close()
        return "Error"


def bucle(scheduler):
    main()
    scheduler.enter(900, 1, bucle, (scheduler,))

if __name__ == "__main__":
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()

# main()
