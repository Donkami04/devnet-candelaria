import requests, warnings, os, datetime, time, calendar, mysql.connector, logging, traceback, sched
from dotenv import load_dotenv
from config import database
from command_ap import ap_function
from status_ap import status_ap_function

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


def getData():
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
            
        data_switches = [sw for sw in data_switches if sw.get('category') == 'AP']
        for switch in data_switches:
            ip_switch = switch['ip']
            name_switch = switch['name_switch']
            red = switch['red']
            logging.info(f"{ip_switch} - {name_switch} - {red}")
            
            id_prtg_switch = get_id_prtg(ip_switch)
            # ap_registered = get_data_ap_registered(ip_switch, id_prtg_switch, red)
            data_systemhealth = system_health(ip_switch, id_prtg_switch, red)
            ap_elements_list = ap_function(ip_switch)
            logging.info(f"Numero de AP obtenidos de la controladora: {len(ap_elements_list)}")

            for sensor in data_systemhealth:
                name_sensor = sensor['name']
                if name_sensor == 'No Devices Found':
                    break
                status_sensor = sensor['status']
                id_prtg = sensor['objid']
                lastvalue = sensor['lastvalue']
                red_sensor = sensor['red']
                query = "INSERT INTO dcs.system_health (name, status, id_prtg, lastvalue, ip_switch, name_switch, red) VALUES (%s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE name = %s, status = %s, lastvalue = %s"
                cursor.execute(query, (name_sensor, status_sensor, id_prtg, lastvalue, ip_switch, name_switch, red_sensor, name_sensor, status_sensor, lastvalue))
                mydb.commit()

                # query_historic = "INSERT INTO dcs.historic_system_health (name, status, id_prtg, lastvalue, ip_switch, name_switch, red) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                # cursor.execute(query_historic, (name_sensor, status_sensor, id_prtg, lastvalue, ip_switch, name_switch, red_sensor))
                # mydb.commit()
                

            # Blanqueamos la tabla AP antes de rellenarla de nuevo
            query = (f"DELETE FROM dcs.ap")
            cursor.execute(query)
            mydb.commit()
            
            # Guardamos en bloque en la BD en vez de linea por linea
            query = "INSERT INTO dcs.ap (`name`, `ip`, `status`, `last_disconnect_reason`) VALUES (%s, %s, %s, %s)"
            values = [(ap['name'], ap['ip'], ap['status'], ap['last_disconnect_reason']) for ap in ap_elements_list]
            cursor.executemany(query, values)
            mydb.commit()
            
            #! Lo comentado se usa para llenar data_ap
            #TODO: NO BORRAR
            # for neigh in ap_elements_list:
                # name = neigh['name']
                # model = neigh['model']
                # ip_ap = neigh['ip']
                # state = neigh['state']
                # location = neigh['location']
                # query = "INSERT INTO dcs.data_ap (`name`, `model`, `ip`, `state`, `location`) VALUES (%s, %s, %s, %s, %s)"
                # cursor.execute(query, (name, model, ip_ap, state, location))
                # mydb.commit()
                
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO dcs.fechas_consultas_ig (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'OK')")
        mydb.commit()
        cursor.close()
        logging.info("Terminado")

    except Exception as e:
        logging.error(traceback.format_exc())
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO dcs.fechas_consultas_ig (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')")
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
def get_data_ap_registered(ip_switch, id_switch, red):
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
        url_interfaces = os.getenv("URL_PRTG_AP_REGISTERED").format(
            id_switch=id_switch
        )
        response_interfaces = requests.get(url_interfaces, verify=False).json()
        interfaces = response_interfaces.get("sensors", interfaces_notFound)

        if interfaces == []:
            return interfaces_notFound

        for interface in interfaces:
            interface["ip_switch"] = ip_switch
            interface["red"] = red
        # print(f"Interfaces: {interfaces}")
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
            
        # print(f"S HEALTH: {devices_systemhealth}")
        return devices_systemhealth

    except Exception as e:
        logging.error(f"Error - Funcion system_health")
        logging.error(e)
        logging.error(traceback.format_exc())
        return devices_systemhealth_notFound


def bucle(scheduler):
    getData()
    scheduler.enter(3600, 1, bucle, (scheduler,))


if __name__ == "__main__":
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()

