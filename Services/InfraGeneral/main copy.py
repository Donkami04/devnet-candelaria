import requests, warnings, os, datetime, time, calendar, mysql.connector, logging, traceback, sched
from dotenv import load_dotenv
from config import database
from command_bgp import bgp_function
from command_ospf import ospf_function
from command_eigrp import eigrp_function
from command_route import route_function
from status_neighbor import status_neighbor
from status_core import ping_host
from commands_ot.clcanot_dcs import eigrp_clcanot_dcs_function
from commands_ot.clcanot_ug import eigrp_clcanot_ug_function
from commands_ot.clcanot_ugmine import eigrp_clcanot_ugmine_function
from interfaces_descriptions import get_interfaces_descriptions

warnings.filterwarnings("ignore", message="Unverified HTTPS request")

logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")
file_handler = logging.FileHandler("issues.log")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(
    logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
)
logging.getLogger().addHandler(file_handler)

load_dotenv()
env = os.getenv('ENVIRONMENT')

def database_connection():
    try:
        if env == 'local':
            mydb = mysql.connector.connect(
            host=database['local']['DB_HOST'],
            user=database['local']['DB_USER'],
            password=database['local']['DB_PASSWORD'],
            database=database['local']['DB_DATABASE']
            )

        else:
            mydb = mysql.connector.connect(
            host=database['production']['DB_HOST'],
            user=database['production']['DB_USER'],
            password=database['production']['DB_PASSWORD'],
            database=database['production']['DB_DATABASE']
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
        
        # Eliminamos del listado la concentradora inalambrica
        data_switches = [sw for sw in data_switches if sw['category'] != 'AP']
        # data_switches = [
        #     {'ip':'10.224.127.3', 'red': 'it', 'name_switch': 'SW CORE CONCE', 'is_eigrp':1, 'is_bgp':1, 'is_ospf': 1},
        #     # {'ip':'10.224.127.148', 'red': 'it', 'name_switch': 'SW-CORE-OT-CONCE', 'is_eigrp':0, 'is_bgp':0, 'is_ospf': 1},
        # #     {'ip':'10.224.126.89', 'red': 'it', 'name_switch': 'SW-CORE-OT-ADMIN', 'is_eigrp':0, 'is_bgp':0, 'is_ospf': 0, 'category':"S2S"},
        # ]
        # print(data_switches)

        current_data_neighbors = []
        for switch in data_switches:
            ip_switch = switch['ip']
            name_switch = switch['name_switch']
            red = switch['red']
            logging.info(f"{ip_switch} - {name_switch} - {red}")
            status_core, message_status_core = ping_host(ip_switch)
            cursor.execute(f"UPDATE devnet.status_cores SET `status` = '{status_core}' WHERE `ip` = '{ip_switch}'")
            id_prtg_switch = get_id_prtg(ip_switch)
            data_interfaces = get_data_interfaces(ip_switch, id_prtg_switch, red)
            data_systemhealth = system_health(ip_switch, id_prtg_switch, red)
            
            data_bgp = bgp_function(switch)
            data_eigrp = eigrp_function(switch)
            data_ospf = ospf_function(switch)
            data_clcanot_dcs = eigrp_clcanot_dcs_function(ip_switch, red, name_switch)
            data_clcanot_ug = eigrp_clcanot_ug_function(ip_switch, red, name_switch)
            data_clcanot_ugmine = eigrp_clcanot_ugmine_function(ip_switch, red, name_switch)
            data_neighbors = data_bgp + data_eigrp + data_ospf + data_clcanot_dcs + data_clcanot_ug + data_clcanot_ugmine
            data_neighbors = [e for e in data_neighbors if e.get("name_switch") not in ["CORE-OT-NX-CONC", "CORE-OT-NX-ADM"]]

            for neigh in data_neighbors:
                current_data_neighbors.append(neigh)
                
                #! Lo comentado se usa para llenar data_neighbors
                #TODO: NO BORRAR
                # ip_neighbor = neigh['ip_neighbor']
                # ip_switch = neigh['ip_switch']
                # name = neigh['name_switch']
                # red = neigh['red']
                # neighbor_type = neigh['neighbor']
                # interface = neigh['interface']
                # query = "INSERT INTO devnet.data_neighbors (`ip_neighbor`, `neighbor`, `red`, `name_switch`, `ip_switch`, `interface`) VALUES (%s, %s, %s, %s, %s, %s)"
                # cursor.execute(query, (ip_neighbor, neighbor_type, red, name, ip_switch, interface))
                # mydb.commit()
            
            data_route = route_function(ip_switch, red, name_switch)
            
            if data_route == []:
                pass
            else:
                route_via_bgp = data_route['via_bgp']
                route_name = data_route['name_switch']
                route_red = data_route['red']
                route_ip_switch = data_route['ip_switch']

                query = (f"UPDATE devnet.route_default SET via_bgp = '{route_via_bgp}' WHERE ip_switch = '{route_ip_switch}'")
                #! Query comentado para rellenar tabla de datos fijos
                # query = (f"INSERT INTO devnet.route_default (`via_bgp`, `name_switch`, `red`, `ip_switch`) VALUES ('{route_via_bgp}','{route_name}','{route_red}','{route_ip_switch}')")
                cursor.execute(query)
                mydb.commit()

                query_historic = (f"INSERT INTO devnet.historic_route_default (`via_bgp`, `name_switch`, `red`, `ip_switch`) VALUES ('{route_via_bgp}','{route_name}','{route_red}','{route_ip_switch}')")
                cursor.execute(query_historic)
                mydb.commit()

            for interface in data_interfaces:
                name_interface = interface['name']
                if name_interface == 'No Devices Found':
                    break
                status_interface = interface['status']
                id_prtg = interface['objid']
                red_interface = interface["red"]
                query = "INSERT INTO devnet.interfaces (id_prtg, name, status, ip_switch, name_switch, red) VALUES (%s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE name = %s, status = %s"
                cursor.execute(query, (id_prtg, name_interface, status_interface, ip_switch, name_switch, red_interface, name_interface, status_interface))
                mydb.commit()

                query_historic = "INSERT INTO devnet.historic_interfaces (id_prtg, name, status, ip_switch, name_switch, red) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(query_historic, (id_prtg, name_interface, status_interface, ip_switch, name_switch, red_interface))
                mydb.commit()

            for sensor in data_systemhealth:
                name_sensor = sensor['name']
                if name_sensor == 'No Devices Found':
                    break
                status_sensor = sensor['status']
                id_prtg = sensor['objid']
                lastvalue = sensor['lastvalue']
                red_sensor = sensor['red']
                query = "INSERT INTO devnet.system_health (name, status, id_prtg, lastvalue, ip_switch, name_switch, red) VALUES (%s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE name = %s, status = %s, lastvalue = %s"
                cursor.execute(query, (name_sensor, status_sensor, id_prtg, lastvalue, ip_switch, name_switch, red_sensor, name_sensor, status_sensor, lastvalue))
                mydb.commit()

                query_historic = "INSERT INTO devnet.historic_system_health (name, status, id_prtg, lastvalue, ip_switch, name_switch, red) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(query_historic, (name_sensor, status_sensor, id_prtg, lastvalue, ip_switch, name_switch, red_sensor))
                mydb.commit()
        
        # Agregamos la llave `descrip` a los diccionarios
        # print(f"current_data_neighbors {current_data_neighbors}")
        status_data_neighbors = status_neighbor(mydb, current_data_neighbors)
        # print(f"status_data_neighbors {status_data_neighbors}")
        for element in status_data_neighbors:
            element['descrip'] = ''
            if "Vlan" in element['interface']:
                element['interface'] = element['interface'].replace("Vlan", "Vl")
        #! DESCRIPCION DE LAS INTERFACES
        # print(f"################ status_data_neighbors {status_data_neighbors}")

        interfaces_description = []
        for switch in data_switches:
            data = get_interfaces_descriptions(switch)
            if data != None:
                for element in data:
                    interfaces_description.append(element)
        # print(f"################ interfaces_description {interfaces_description}")
        
        for item in interfaces_description:
            for element in status_data_neighbors:
                if element['name_switch'] == item['name_switch'] and element['interface'] == item['interface']:
                    element['descrip'] = item['descrip']
                    break
        # print(f"################ status_data_neighbors {status_data_neighbors}")
        #! TERMINA BLOQUE DESCRIPCION DE LAS INTERFACES
        
        # Blanqueamos la tabla neighbors antes de rellenarla de nuevo
        query = (f"DELETE FROM devnet.neighbors")
        cursor.execute(query)
        mydb.commit()
        
        # # Guardamos en bloque en la BD en vez de linea por linea
        # query = "INSERT INTO devnet.neighbors (`ip_neighbor`, `neighbor`, `red`, `name_switch`, `ip_switch`, `interface`, `status`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        # query_historic = "INSERT INTO devnet.historic_neighbors (`ip_neighbor`, `neighbor`, `red`, `name_switch`, `ip_switch`, `interface`, `status`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        # values = [(neigh['ip_neighbor'], neigh['neighbor'], neigh['red'], neigh['name_switch'], neigh['ip_switch'],  neigh['interface'], neigh['status']) for neigh in status_data_neighbors]
        # cursor.executemany(query, values)
        # cursor.executemany(query_historic, values)
        # mydb.commit()
        
        #! ACTUALIZAR EN VEZ DE INSERTAR
        query = "INSERT INTO devnet.neighbors (`ip_neighbor`, `neighbor`, `red`, `name_switch`, `ip_switch`, `interface`, `status`, `interface_descrip`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = [(neigh['ip_neighbor'], neigh['neighbor'], neigh['red'], neigh['name_switch'], neigh['ip_switch'],  neigh['interface'], neigh['status'], neigh['descrip']) for neigh in status_data_neighbors]
        cursor.executemany(query, values)
                
        # for neighbor in status_data_neighbors:
        #     ip_neighbor = neighbor['ip_neighbor']
        #     ip_switch = neighbor['ip_switch']
        #     name = neighbor['name_switch']
        #     red = neighbor['red']
        #     neighbor_type = neighbor['neighbor']
        #     interface = neighbor['interface']
        #     status = neighbor['status']
            
        #     query = "INSERT INTO devnet.neighbors (`ip_neighbor`, `neighbor`, `red`, `name_switch`, `ip_switch`, `interface`, `status`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        #     cursor.execute(query, (ip_neighbor, neighbor_type, red, name, ip_switch, interface, status))
        #     mydb.commit()

        #     query_historic = "INSERT INTO devnet.historic_neighbors (`ip_neighbor`, `neighbor`, `red`, `name_switch`, `ip_switch`, `interface`, `status`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        #     cursor.execute(query_historic, (ip_neighbor, neighbor_type, red, name, ip_switch, interface, status))
        #     mydb.commit()
            
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO devnet.fechas_consultas_ig (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'OK')")
        mydb.commit()
        cursor.close()
        logging.info("Terminado")
        
    except Exception as e:
        logging.error(traceback.format_exc())
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO devnet.fechas_consultas_ig (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')")
        mydb.commit()
        cursor.close()

# Obtiene Id del PRTG
def get_id_prtg(ip_switch):
    url_objid = os.getenv("URL_PRTG_GET_ID").format(ip=ip_switch)
    response_objid = requests.get(url_objid, verify=False).json()
    objid = response_objid.get("devices", [{'objid':'Not Found'}])
    if objid == []:
        objid = 'Not Found'
        return objid

    objid = objid[0].get('objid', 'Not Found')
    return objid


# Obtiene informacion de las interfaces en PRTG
def get_data_interfaces(ip_switch, id_switch, red):
    interfaces_notFound = [{
        "name": "No Devices Found",
        "status": "Down",
        "objid": "Not Found",
        "ip_switch":{ip_switch},
        "red": "Not Found"
    }]
    try:
        url_interfaces = os.getenv("URL_PRTG_GET_STATUS_INTERFACES").format(id_switch=id_switch)
        response_interfaces = requests.get(url_interfaces, verify=False).json()
        interfaces = response_interfaces.get("sensors", interfaces_notFound)

        if interfaces == []:
            return interfaces_notFound

        for interface in interfaces:
            interface['ip_switch'] = ip_switch
            interface['red'] = red

        return interfaces

    except Exception as e:
        logging.error(f"Error - Funcion core1-interfaces")
        logging.error(e)
        logging.error(traceback.format_exc())
        return interfaces_notFound

# Obtiene Datos de los System Health
def system_health(ip_switch, id_switch, red):

    devices_systemhealth_notFound = [{
        "name": "No Devices Found",
        "status": "Down",
        "objid": "Not Found",
        "lastvalue": "Not Found",
        "ip_switch": {ip_switch},
        "red": "Not Found"
    }]

    try:
        url_system_health = os.getenv("URL_PRTG_GET_STATUS_SYSTEM_HEALTH").format(id_switch=id_switch)
        response_systemhealth = requests.get(url_system_health, verify=False).json()
        devices_systemhealth = response_systemhealth.get("sensors", devices_systemhealth_notFound)

        if devices_systemhealth == []:
            return devices_systemhealth_notFound

        for device in devices_systemhealth:
            device['ip_switch'] = ip_switch
            device['red'] = red
        return devices_systemhealth

    except Exception as e:
        logging.error(f"Error - Funcion system_health")
        logging.error(e)
        logging.error(traceback.format_exc())
        return devices_systemhealth_notFound


def bucle(scheduler):
    core1()
    scheduler.enter(7200, 1, bucle, (scheduler,))

if __name__ == '__main__':
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()