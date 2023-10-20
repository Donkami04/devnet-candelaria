import xml.etree.ElementTree as ET
import requests, warnings, os, datetime, time, calendar, mysql.connector, logging, traceback, sched
from dotenv import load_dotenv
from config import database
from command_bgp import bgp_function
from command_ospf import ospf_function
from command_eigrp import eigrp_function
from command_route import route_function

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


def core1():
    mydb = database_connection()
    cursor = mydb.cursor()
    data_switches = [
        # {'ip':'10.224.127.1', 'red': 'it', 'name': 'SW-CORE-ADMIN'},
        {'ip':'10.224.127.2', 'red': 'it', 'name': 'SW-CORE-CONCE'}
    ]
    
    for switch in data_switches:
        ip_switch = switch['ip']
        name = switch['name']
        red = switch['red']
        
        id_prtg_switch = get_id_prtg(ip_switch)
        data_interfaces = get_data_interfaces(ip_switch, id_prtg_switch)
        data_systemhealth = system_health(ip_switch, id_prtg_switch)
        data_bgp = bgp_function(ip_switch, red, name)
        data_eigrp = eigrp_function(ip_switch, red, name)
        data_ospf = ospf_function(ip_switch, red, name)
        # data_route = route_function(ip_switch, red, name)
        
        data_neighbors = data_bgp + data_eigrp + data_ospf
        print(data_neighbors)

        for data in data_neighbors:
            ip_neighbor = data['ip_neighbor']
            ip_switch = data['ip_switch']
            red = data['red']
            name = data['name']
            neighbor = data['neighbor']
            query = f"INSERT INTO dcs.inf_gen_netmiko (`ip_neighbor`, `neighbor`, `red`, `name`, `ip_switch`) VALUES ('{ip_neighbor}','{neighbor}','{red}','{name}','{ip_switch}')"
            cursor.execute(query)
            mydb.commit()       

    
        for interface in data_interfaces:
            name_interface = interface['name']
            if name_interface == 'No Devices Found':
                break
            status_interface = interface['status']
            id_prtg = interface['objid']
            query = "INSERT INTO dcs.interfaces (id_prtg, name, status, ip_switch) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE name = %s, status = %s"
            cursor.execute(query, (id_prtg, name_interface, status_interface, ip_switch, name_interface, status_interface))
            mydb.commit()
            
        for sensor in data_systemhealth:
            name_sensor = sensor['name']
            if name_sensor == 'No Devices Found':
                break
            status_sensor = sensor['status']
            id_prtg = sensor['objid']
            lastvalue = sensor['lastvalue']
            query = "INSERT INTO dcs.system_health (name, status, id_prtg, lastvalue, ip_switch) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE name = %s, status = %s, lastvalue = %s"
            cursor.execute(query, (name_sensor, status_sensor, id_prtg, lastvalue, ip_switch, name_sensor, status_sensor, lastvalue))
            mydb.commit()
        
    cursor.close()
    
def get_id_prtg(ip_switch):
    url_objid = os.getenv("URL_PRTG_GET_ID").format(ip=ip_switch)
    response_objid = requests.get(url_objid, verify=False).json()
    objid = response_objid.get("devices", [{'objid':'Not Found'}])
    
    if objid == []:
        objid = 'Not Found'
        return objid
    
    objid = objid[0].get('objid', 'Not Found')
    return objid


def get_data_interfaces(ip_switch, id_switch): 
    interfaces_notFound = [{
        "name": "No Devices Found", 
        "status": "Down", 
        "objid": "Not Found", 
        "ip_switch":{ip_switch}
    }]
    try:
        url_interfaces = os.getenv("URL_PRTG_GET_STATUS_INTERFACES").format(id_switch=id_switch)
        response_interfaces = requests.get(url_interfaces, verify=False).json()
        interfaces = response_interfaces.get("sensors", interfaces_notFound)
        
        if interfaces == []:
            return interfaces_notFound
        
        for interface in interfaces:
            interface['ip_switch'] = ip_switch
            
        return interfaces
            
    except Exception as e:
        logging.error(f"Error - Funcion core1-interfaces")
        logging.error(e)
        logging.error(traceback.format_exc())
        return interfaces_notFound
    

def system_health(ip_switch, id_switch):
    
    devices_systemhealth_notFound = [{
        "name": "No Devices Found", 
        "status": "Down", 
        "objid": "Not Found",
        "lastvalue": "Not Found",
        "ip_switch": {ip_switch}
    }]
    
    try:
        url_system_health = os.getenv("URL_PRTG_GET_STATUS_SYSTEM_HEALTH").format(id_switch=id_switch)
        response_systemhealth = requests.get(url_system_health, verify=False).json()
        devices_systemhealth = response_systemhealth.get("sensors", devices_systemhealth_notFound)
        
        if devices_systemhealth == []:
            return devices_systemhealth_notFound
        
        for device in devices_systemhealth:
            device['ip_switch'] = ip_switch
            
        return devices_systemhealth
            
    except Exception as e:
        logging.error(f"Error - Funcion system_health")
        logging.error(e)
        logging.error(traceback.format_exc())
        return devices_systemhealth_notFound



# Llamar a la función para probarla
core1()



# def bucle(scheduler):
#     get_uptime()
#     scheduler.enter(7200, 1, bucle, (scheduler,))

# if __name__ == '__main__':
#     s = sched.scheduler(time.time, time.sleep)
#     s.enter(0, 1, bucle, (s,))
#     s.run()
