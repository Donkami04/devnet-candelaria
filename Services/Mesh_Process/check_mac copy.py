
import logging
import mysql.connector
import traceback
import os
from dotenv import load_dotenv
from config import database


"""
    Funcion encargada de validar si `current_mac` se repite en algun otro elemento,
    de repetirse se define el valor de `status` = 'fail', si no se repite se define como 'ok'
"""

# Configuración básica de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s: %(message)s"
)


def database_connection():
    try:
        load_dotenv()
        env = os.getenv("ENVIRONMENT")
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


def check_mac():

    #Funcion encargada de validar el estado "fail" u "ok" de cada cliente mesh
    #esto dependera de si el valor de current mac se repite en otra ubication

    try:
        # mydb = database_connection()
        # cursor = mydb.cursor()
        # query = "SELECT * FROM dcs.mesh_process"
        # cursor.execute(query)

        # # Obtenemos la lista con los datos de los diccionarios actualizados
        # column_names = [column[0] for column in cursor.description]
        # data_updated = []
        # for row in cursor:
        #     row_dict = {}
        #     for i in range(len(column_names)):
        #         row_dict[column_names[i]] = row[i]
        #     data_updated.append(row_dict)
            
        #! DATA TEST    
        data_updated = [
            {
                "id": 353,
                "ubication": "Pala 10",
                "device": "Cisco AP",
                "client": "10.117.115.110",
                "last_mac": "No data",
                "current_mac": "MAC PALA 10",
                "note": "No data",
                "last_change_date": "No data",
                "status": "ok",
            },
            {
                "id": 349,
                "ubication": "Camion 318",
                "device": "UMAN",
                "client": "10.117.126.118",
                "last_mac": "No data",
                "current_mac": "MAC PALA 10",
                "note": "No data",
                "last_change_date": "No data",
                "status": "ok",
            },
        ]
        
        for data in data_updated:
            if data["note"] == "NAT":
                data["status"] = "ok"
            else:
                if (
                    data["current_mac"] != "No data"
                    and data["current_mac"] != "Not Found"
                    and data["current_mac"] != "b827.eb80.f108"
                ):
                    # Inicializar un conjunto para rastrear las MACs únicas y otro para las duplicadas
                    macs_vistas = set()
                    macs_duplicadas = set()

                    # Primer bucle para identificar las MACs duplicadas
                    for diccionario in data_updated:
                        current_mac = diccionario["current_mac"]
                        if current_mac in macs_vistas:
                            macs_duplicadas.add(current_mac)
                        else:
                            macs_vistas.add(current_mac)

                    # Segundo bucle para actualizar los diccionarios con 'status': 'fail'
                    for diccionario in data_updated:
                        if diccionario["current_mac"] in macs_duplicadas:
                            diccionario["status"] = "fail"
        print(data_updated)


        # for data in data_updated:
        #     if data["client"] != "10.117.126.100":
        #         status = data["status"]
        #         query_mac = f"UPDATE dcs.mesh_process SET status = '{status}' WHERE client = '{data['client']}'"
        #         cursor.execute(query_mac)
        #         mydb.commit()

        logging.info("CHECK_MAC: Estados de los clientes Actualizado Exitosamente")
        # cursor.close()
        # return data_updated

    except Exception as e:
        logging.error("Error en la funcion CHECK_MAC")
        logging.error(e)
        logging.error(traceback.format_exc())

check_mac()