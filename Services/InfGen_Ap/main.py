import requests, warnings, os, datetime, time, calendar, mysql.connector, logging, traceback, sched
from dotenv import load_dotenv
from config import database

warnings.filterwarnings("ignore", message="Unverified HTTPS request")

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


def core1():
    try:
        mydb = database_connection()
        cursor = mydb.cursor()
        query = "SELECT * FROM data_inf_gen"
        cursor.execute(query)

        column_names = [column[0] for column in cursor.description]

        # Convertir los resultados a una lista de diccionarios
        data_switches = []
        for row in cursor:
            row_dict = {}
            for i in range(len(column_names)):
                row_dict[column_names[i]] = row[i]
            data_switches.append(row_dict)

        # data_switches = [
        #     # {'ip':'10.224.127.1', 'red': 'it', 'name_switch': 'ADMIN'},
        #     # {'ip':'10.224.127.2', 'red': 'it', 'name_switch': 'CONCE'},
        #     # {'ip':'10.230.127.1', 'red': 'it', 'name_switch': 'SW CORE OJOS'},
        #     # {'ip':'10.224.127.3', 'red': 'it', 'name_switch': 'DIST-ADM'},
        #     # {'ip':'10.224.127.4', 'red': 'it', 'name_switch': 'DIST-CONC'},
        #     # {'ip':'10.224.127.160', 'red': 'it', 'name_switch': 'ADMIN-DNA'},
        #     # {'ip':'10.224.127.161', 'red': 'it', 'name_switch': 'CONCE-DNA'},
        # ]

        cursor.close()
        logging.info("Terminado")

    except Exception as e:
        logging.error(traceback.format_exc())
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(
            f"INSERT INTO dcs.fechas_consultas_ig (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')"
        )
        mydb.commit()
        cursor.close()


# Obtiene Id del PRTG
def get_id_prtg(ip_switch):
    url_objid = os.getenv("URL_PRTG_GET_ID").format(ip=ip_switch)
    response_objid = requests.get(url_objid, verify=False).json()
    objid = response_objid.get("devices", [{"objid": "Not Found"}])

    if objid == []:
        objid = "Not Found"
        return objid

    objid = objid[0].get("objid", "Not Found")
    return objid


# Obtiene informacion de las interfaces en PRTG
def get_data_interfaces(ip_switch, id_switch, red):
    interfaces_notFound = [
        {
            "name": "No Devices Found",
            "status": "Down",
            "objid": "Not Found",
            "ip_switch": {ip_switch},
            "red": "Not Found",
        }
    ]
    try:
        url_interfaces = os.getenv("URL_PRTG_GET_STATUS_INTERFACES").format(
            id_switch=id_switch
        )
        response_interfaces = requests.get(url_interfaces, verify=False).json()
        interfaces = response_interfaces.get("sensors", interfaces_notFound)

        if interfaces == []:
            return interfaces_notFound

        for interface in interfaces:
            interface["ip_switch"] = ip_switch
            interface["red"] = red

        return interfaces

    except Exception as e:
        logging.error(f"Error - Funcion core1-interfaces")
        logging.error(e)
        logging.error(traceback.format_exc())
        return interfaces_notFound


# Obtiene Datos de los System Health
def system_health(ip_switch, id_switch, red):
    devices_systemhealth_notFound = [
        {
            "name": "No Devices Found",
            "status": "Down",
            "objid": "Not Found",
            "lastvalue": "Not Found",
            "ip_switch": {ip_switch},
            "red": "Not Found",
        }
    ]

    try:
        url_system_health = os.getenv("URL_PRTG_GET_STATUS_SYSTEM_HEALTH").format(
            id_switch=id_switch
        )
        response_systemhealth = requests.get(url_system_health, verify=False).json()
        devices_systemhealth = response_systemhealth.get(
            "sensors", devices_systemhealth_notFound
        )

        if devices_systemhealth == []:
            return devices_systemhealth_notFound

        for device in devices_systemhealth:
            device["ip_switch"] = ip_switch
            device["red"] = red
        return devices_systemhealth

    except Exception as e:
        logging.error(f"Error - Funcion system_health")
        logging.error(e)
        logging.error(traceback.format_exc())
        return devices_systemhealth_notFound


def bucle(scheduler):
    core1()
    scheduler.enter(7200, 1, bucle, (scheduler,))


if __name__ == "__main__":
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()
