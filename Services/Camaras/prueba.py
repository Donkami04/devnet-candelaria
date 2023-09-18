import warnings, requests, os, time, traceback, datetime, sched, re,logging, json
import mysql.connector
from dotenv import load_dotenv
from config import database

# Esto evita que las respuestas de las API tengan warnings.
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(file_handler)

def get_devices_data():
    load_dotenv()
    env = os.getenv('ENVIRONMENT')
    
    if env == 'local':
        mydb = mysql.connector.connect(
        host=database['local']['DB_HOST'],
        user=database['local']['DB_USER'],
        password=database['local']['DB_PASSWORD'],
        database=database['local']['DB_DATABASE']
        )
        
    if env == 'production':
        mydb = mysql.connector.connect(
        host=database['production']['DB_HOST'],
        user=database['production']['DB_USER'],
        password=database['production']['DB_PASSWORD'],
        database=database['production']['DB_DATABASE']
        )
        
    cursor = mydb.cursor()
    query = "SELECT * FROM dcs.data_devices"
    cursor.execute(query)

    column_names = [column[0] for column in cursor.description]

    # Convertir los resultados a una lista de diccionarios
    devices = []
    # devices = [{
    #     'id':1,
    #     'ip':'10.224.4.31',
    #     'type_device':'Camara',
    #     'site':'casa',
    #     'dpto': 'asda',
    #     'red': 'IT'
    # }]
    for row in cursor:
        row_dict = {}
        for i in range(len(column_names)):
            row_dict[column_names[i]] = row[i]
        devices.append(row_dict)

    try:   
        for device in devices:
            ip = device['ip']
            logging.info(ip)
            device_type = device['type_device']
            site = device['site']
            dpto = device['dpto']
            red_type = device['red']
            
            URL_PRTG_GET_ID = os.getenv('URL_PRTG_IP').format(ip=ip)
            response_prtg_get_id = requests.get(URL_PRTG_GET_ID, verify=False).json()
            if len(response_prtg_get_id['devices']) == 0:
                prtg_name_device = 'Not Found'
                prtg_id_device = 'Not Found'
                prtg_name_sensor = 'Not Found'
                prtg_status = 'Not Found'
                prtg_lastup = 'Not Found'
                prtg_lastdown = 'Not Found'

            else:
                prtg_id_device = response_prtg_get_id['devices'][0]['objid']
                URL_PRTG_GET_DATA = os.getenv('URL_PRTG_ID').format(id_device=prtg_id_device)
                response_prtg_data = requests.get(URL_PRTG_GET_DATA, verify=False).json()
 
                try:
                    sensor = response_prtg_data['sensors'][0]
                    prtg_name_sensor = sensor['name']
                    prtg_name_device = sensor['device']
                    prtg_status = sensor['status']
                    prtg_lastup = sensor['lastup']
                    prtg_lastdown = sensor['lastdown']
                    
                    patron = re.compile(r'<.*?>') # Se usa para formatear el last_up y last_down
                    prtg_lastup =  re.sub(patron, '', prtg_lastup)
                    prtg_lastdown =  re.sub(patron, '', prtg_lastdown)
                except:
                    prtg_name_sensor = 'Not Found'
                    prtg_name_device = 'Not Found'
                    prtg_status = 'Not Found'
                    prtg_lastup = 'Not Found'
                    prtg_lastdown = 'Not Found'

            if device['red'] == 'IT':
                red = '10.224.116.90'
            else:
                red = '10.224.241.14'
                
            URL_CISCO_GET_ID = os.getenv('URL_CISCO_IP').format(red=red, ip=ip)
            response_cisco_get_id = requests.get(URL_CISCO_GET_ID, verify=False).json()
            response_cisco_get_id = json.dumps(response_cisco_get_id)
            response_cisco_get_id = json.loads(response_cisco_get_id)
            cisco_id_device = response_cisco_get_id.get('queryResponse', {'queryResponse':'Not Found'}).get('entityId', [{}])[0].get('$', 'Not Found')

            if cisco_id_device == 'Not Found':
                try:
                    query = f"SELECT * FROM dcs.devices WHERE host = '{ip}' AND cisco_device_name <> 'Not Found' ORDER BY id DESC LIMIT 1"
                    cursor.execute(query)
                    results = cursor.fetchall()
                    data_backup = [dict(zip(cursor.column_names, row)) for row in results]
                    data_backup = data_backup[0]
                    
                    cisco_device_ip_adrress = data_backup['cisco_device_ip']
                    cisco_device_name = data_backup['cisco_device_name']
                    cisco_client_port = data_backup['cisco_port']
                    cisco_client_status = data_backup['cisco_status']
                    cisco_device_reachability = data_backup['cisco_reachability']
                    prtg_device_status = data_backup['cisco_status_device']
                    cisco_client_mac_address = data_backup['cisco_mac_address']
                    is_databackup = 'true'

                except:
                    cisco_device_ip_adrress = 'Not Found'
                    cisco_device_name = 'Not Found'
                    cisco_client_port = 'Not Found'
                    cisco_client_status = 'Not Found'
                    cisco_device_reachability = 'Not Found'
                    prtg_device_status = 'Not Found'
                    cisco_client_mac_address = 'Not Found'
                    is_databackup = 'false'

            else:
                is_databackup = 'false'
                URL_CISCO_ID = os.getenv('URL_CISCO_ID').format(red=red, cisco_id_device=cisco_id_device)
                cisco_client_response = requests.get(URL_CISCO_ID, verify=False).json()
                cisco_client_data = cisco_client_response['queryResponse']['entity'][0]['clientsDTO']
                cisco_client_port = cisco_client_data['clientInterface']
                cisco_client_status = cisco_client_data['status']
                cisco_client_mac_address = cisco_client_data['macAddress']['octets']
                
                cisco_device_name = cisco_client_data['deviceName']
                cisco_device_ip_adrress = cisco_client_data['deviceIpAddress']['address']

                prtg_device_ip_url = os.getenv('URL_PRTG_IP').format(ip=cisco_device_ip_adrress)
                prtg_device_ip_response = requests.get(prtg_device_ip_url, verify=False).json()
                
                if prtg_device_ip_response['treesize'] == 0:
                    prtg_device_status = 'Not Found'
                
                else:
                    prtg_device_id = prtg_device_ip_response['devices'][0]['objid']
                    prtg_device_id_url = os.getenv('URL_PRTG_ID').format(id_device=prtg_device_id)
                    prtg_device_status_response = requests.get(prtg_device_id_url, verify=False).json()
                    prtg_device_status = prtg_device_status_response['sensors'][0]['status']
                    
                CISCO_DEVICE_IP_URL = os.getenv('URL_CISCO_IP').format(red=red, ip=cisco_device_ip_adrress)
                cisco_device_ip_response = requests.get(CISCO_DEVICE_IP_URL, verify=False).json()
                if cisco_device_ip_response['queryResponse']['@count'] == 0:
                    cisco_device_reachability = 'Not Found'
                else:
                    cisco_device_id = cisco_device_ip_response['queryResponse']['entityId'][0]['$']
                    CISCO_DEVICE_ID_URL = os.getenv('URL_CISCO_ID_DEVICE').format(red=red, id_device=cisco_device_id)
                    cisco_device_id_response = requests.get(CISCO_DEVICE_ID_URL, verify=False).json()
                    # logging.info(f"cisco_device_id_response: {cisco_device_id_response}")
                    # cisco_device_reachability = cisco_device_id_response['queryResponse']['entity'][0]['devicesDTO']['reachability']
                    cisco_device_reachability = cisco_device_id_response.get('queryResponse', {}).get('entity', [{}])[0].get('devicesDTO', {}).get('reachability', 'Not Found')
                    logging.info(f"cisco_device_reachability: {cisco_device_reachability}")

                    
            # print(f"Esta es la red: {red}")
            query = (f"INSERT INTO dcs.devices (host, type, site, dpto, prtg_name_device, prtg_id, prtg_sensorname, prtg_status, prtg_lastup, prtg_lastdown, cisco_device_ip, cisco_device_name, cisco_port, cisco_status, cisco_reachability, cisco_status_device, cisco_mac_address, data_backup, red)"
                f"VALUES ('{ip}', '{device_type}', '{site}', '{dpto}', '{prtg_name_device}', '{prtg_id_device}', '{prtg_name_sensor}', '{prtg_status}', '{prtg_lastup}', '{prtg_lastdown}', '{cisco_device_ip_adrress}', '{cisco_device_name}', '{cisco_client_port}', '{cisco_client_status}', '{cisco_device_reachability}', '{prtg_device_status}', '{cisco_client_mac_address}', '{is_databackup}', '{red_type}')")
            cursor.execute(query)
            mydb.commit()
            
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO dcs.fechas_consultas_devices (`ultima_consulta`, `estado`) VALUES ('{fecha_y_hora}', 'OK')")
        mydb.commit()
        cursor.close()
    
        logging.info('Terminado')       
                
    except Exception:
        logging.error(traceback.format_exc())
        logging.error(ip)
        logging.error(cisco_device_id_response['queryResponse'])
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO dcs.fechas_consultas_devices (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')")
        mydb.commit()
        cursor.close()
                    
def bucle(scheduler):
    get_devices_data()
    scheduler.enter(300, 1, bucle, (scheduler,))

if __name__ == '__main__':
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()