import logging
import mysql.connector
import traceback
import os
import requests
import warnings
from dotenv import load_dotenv
from config import database


"""
    Funcion encargada de actualizar el estado PRTG de cada Cliente Mesh
"""

# Configuración básica de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s: %(message)s"
)

warnings.filterwarnings("ignore", message="Unverified HTTPS request")

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
        logging.error("Error al conectarse a la base de datos en la funcion CHECK_MAC")
        logging.error(traceback.format_exc())
        logging.error(e)

def status_prtg():
    try:
        mydb = database_connection()
        cursor = mydb.cursor()
        query = "SELECT * FROM dcs.mesh_process"
        cursor.execute(query)

        # Obtenemos la lista con los datos de los diccionarios actualizados
        column_names = [column[0] for column in cursor.description]
        data = []
        for row in cursor:
            row_dict = {}
            for i in range(len(column_names)):
                row_dict[column_names[i]] = row[i]
            data.append(row_dict)

        #! Data Test
        # data = [
        #     {
        #         "id": 353,
        #         "ubication": "Pala 10",
        #         "device": "Cisco AP",
        #         "client": "10.117.115.110",
        #         "last_mac": "f01d.2d55.7512",
        #         "current_mac": "f01d.2d55.7512",
        #         "note": "No data",
        #         "last_change_date": "No data",
        #         "status": "ok",
        #     },
        #     {
        #         "id": 349,
        #         "ubication": "Camion 318",
        #         "device": "UMAN",
        #         "client": "10.117.126.118",
        #         "last_mac": "No data",
        #         "current_mac": "No data",
        #         "note": "No data",
        #         "last_change_date": "No data",
        #         "status": "ok",
        #     },
        # ]

        # Obtiene Id del PRTG
        logging.info("STATUS_PRTG: Actualizando estados PRTG")

        env_map = {
            "local": "localhost",
            "development": "10.224.116.78",
            "production": "10.224.116.14",
        }

        api_env = env_map.get(env, None)

        for sensor in data:
            ip_client = sensor["client"]
            if "pala" in sensor["ubication"].lower():
                # Si se encuentra el estado 2 entonces que haga la peticion API y valide status dispatch
                # Si no definir, prtg_status = 'No operando', prtg_id = 0 en la DB
                api_candelaria = os.getenv("API_STATUS_PALA").format(env=api_env)
                response_api_candelaria = requests.get(
                    api_candelaria, verify=False
                ).json()
                pala = next(
                    (
                        mesh_pala
                        for mesh_pala in response_api_candelaria
                        if mesh_pala["ip"] == ip_client
                    ),
                    None,
                )
                if pala == None or "2" not in pala["status_dispatch"]:
                    query = f"UPDATE dcs.mesh_process SET prtg_status = 'No operando', prtg_id = 0 WHERE client = '{ip_client}'"
                    cursor.execute(query)
                    mydb.commit()
                    continue

            api_prtg_getid = os.getenv("URL_GET_ID_PING").format(ip=ip_client)
            response_api_getid = requests.get(api_prtg_getid, verify=False).json()
            devices = response_api_getid.get("devices")

            if devices == []:
                query = f"UPDATE dcs.mesh_process SET prtg_status = 'Not Found', prtg_id = 0 WHERE client = '{ip_client}'"
                cursor.execute(query)
                mydb.commit()

            if devices != []:
                objid = devices[0]["objid"]
                api_prtg_data = os.getenv("URL_GET_DATA").format(objid=objid)
                response_api_data = requests.get(api_prtg_data, verify=False).json()
                prtg_status = response_api_data["sensors"][0]["status"]
                query = f"UPDATE dcs.mesh_process SET prtg_status = '{prtg_status}', prtg_id = '{objid}' WHERE client = '{ip_client}'"
                cursor.execute(query)
                mydb.commit()

        logging.info("STATUS_PRTG: Estados de los clientes Actualizado Exitosamente")
        cursor.close()

    except Exception as e:
        logging.error("Error en la funcion STATUS_PRTG")
        logging.error(e)
        logging.error(traceback.format_exc())


# status_prtg()
