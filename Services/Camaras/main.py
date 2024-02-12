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

load_dotenv()
def get_devices_data():
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
    #     'ip':'10.225.6.17',
    #     'type_device':'Camara',
    #     'site':'casa',
    #     'dpto': 'asda',
    #     'red': 'OT'
    # }]
    for row in cursor:
        row_dict = {}
        for i in range(len(column_names)):
            row_dict[column_names[i]] = row[i]
        devices.append(row_dict)

    try:
        username_cctv = os.getenv('CCTV_USER')
        password_cctv = os.getenv('CCT_PASS')
        auth = (username_cctv, password_cctv)
        cctv_list_servers = ['10.225.0.253']
        # cctv_list_servers = ['10.225.0.253', '10.231.0.253', '10.225.11.253', '10.231.10.253']
        cctv_data = []
        
        for ip in cctv_list_servers:
            CCTV_API = os.getenv('CCTV_BASE_URL').format(ip_server=ip)  
            cctv_response = requests.get(CCTV_API, auth=auth).json()
            data = cctv_response['data']
            cctv_data = cctv_data + data
        
        for device in devices:
            ip = device['ip']
            logging.info(ip)
            device_type = device['type_device']
            site = device['site']
            dpto = device['dpto']
            red_type = device['red']

            prtg_data = get_prtg_data(ip)
            prtg_name_device = prtg_data.get('prtg_name_device', 'Not Found')
            prtg_id_device = prtg_data.get('prtg_id_device', 'Not Found')
            prtg_name_sensor = prtg_data.get('prtg_name_sensor', 'Not Found')
            prtg_status = prtg_data.get('prtg_status', 'Not Found')
            prtg_lastup = prtg_data.get('prtg_lastup', 'Not Found')
            prtg_lastdown = prtg_data.get('prtg_lastdown', 'Not Found')
            
            if device['red'] == 'IT':
                red = '10.224.116.90'
            else:
                red = '10.224.241.14'
                
            cisco_data = get_cisco_data(cursor, red, ip)
            cisco_device_ip_adress = cisco_data['cisco_device_ip_adress']
            cisco_device_name = cisco_data['cisco_device_name']
            cisco_client_port = cisco_data['cisco_client_port']
            cisco_client_status = cisco_data['cisco_client_status']
            # cisco_device_reachability = cisco_data['cisco_device_reachability']
            prtg_device_status = cisco_data['prtg_device_status']
            cisco_client_mac_address = cisco_data['cisco_client_mac_address']
            is_databackup = cisco_data['is_databackup']
            cctv_enabled = "N/A"
            cctv_valid = "N/A"
            
            # Si el tipo de dispositivo es camara buscamos la IP de esta en el listado obtenido de la API de CCTV
            # Si no lo encuentra enabled y valid son Not Found
            if device_type == 'Camara' or device_type == 'Cámara':
                cctv_enabled = "Not Found"
                cctv_valid = "Not Found"
                for data in cctv_data:
                    if data['url'] == ip:
                        cctv_enabled = data.get('status', 'Error').get('enabled', 'Error')
                        cctv_valid = data.get('status', 'Error').get('valid', 'Error')
            
            # if device['id_cctv'] != 'Not Found':
            #     id_camera = device['id_cctv']
            #     username_cctv = os.getenv('CCTV_USER')
            #     password_cctv = os.getenv('CCT_PASS')
            #     CCTV_DATA_SINGLE_CAMERA = os.getenv('CCTV_DATA_SINGLE_CAMERA').format(id_camera=id_camera)

            #     auth = (username_cctv, password_cctv)
            #     data_camera = requests.get(CCTV_DATA_SINGLE_CAMERA, auth=auth).json()
            #     cctv_enabled = data_camera.get('data', 'Error').get('status', 'Error').get('enabled', 'Error')
            #     cctv_valid = data_camera.get('data', 'Error').get('status', 'Error').get('valid', 'Error')
            
            
            query = (f"INSERT INTO dcs.devices (host, type, site, dpto, prtg_name_device, prtg_id, prtg_sensorname, prtg_status, prtg_lastup, prtg_lastdown, cisco_device_ip, cisco_device_name, cisco_port, cisco_status, cisco_status_device, cisco_mac_address, data_backup, red, cctv_enabled, cctv_valid)"
                f"VALUES ('{ip}', '{device_type}', '{site}', '{dpto}', '{prtg_name_device}', '{prtg_id_device}', '{prtg_name_sensor}', '{prtg_status}', '{prtg_lastup}', '{prtg_lastdown}', '{cisco_device_ip_adress}', '{cisco_device_name}', '{cisco_client_port}', '{cisco_client_status}', '{prtg_device_status}', '{cisco_client_mac_address}', '{is_databackup}', '{red_type}', '{cctv_enabled}', '{cctv_valid}')")
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
        # logging.error(cisco_device_id_response['queryResponse'])
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO dcs.fechas_consultas_devices (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')")
        mydb.commit()
        # cursor.close()
        
def get_prtg_data(ip):
    prtg_data = {
        'prtg_id_device': 'Not Found',
        'prtg_name_device': 'Not Found',
        'prtg_name_sensor': 'Not Found',
        'prtg_status': 'Not Found',
        'prtg_lastup': 'Not Found',
        'prtg_lastdown': 'Not Found'
    }
    try:

        URL_PRTG_GET_ID = os.getenv('URL_PRTG_IP').format(ip=ip)
        response_prtg_get_id = requests.get(URL_PRTG_GET_ID, verify=False).json()
        if len(response_prtg_get_id['devices']) == 0:
            return prtg_data

        else:
            prtg_id_device = response_prtg_get_id['devices'][0]['objid']
            URL_PRTG_GET_DATA = os.getenv('URL_PRTG_ID').format(id_device=prtg_id_device)
            response_prtg_data = requests.get(URL_PRTG_GET_DATA, verify=False).json()
            try:
                sensor = response_prtg_data['sensors'][0]
                prtg_data['prtg_id_device'] = prtg_id_device
                prtg_data['prtg_name_sensor'] = sensor.get('name', 'Not Found')
                prtg_data['prtg_name_device'] = sensor.get('device', 'Not Found')
                prtg_data['prtg_status'] = sensor.get('status', 'Not Found')
                prtg_data['prtg_lastup'] = re.sub(re.compile(r'<.*?>'), '', sensor.get('lastup', 'Not Found'))
                prtg_data['prtg_lastdown'] = re.sub(re.compile(r'<.*?>'), '', sensor.get('lastdown', 'Not Found'))
                return prtg_data
            
            except:
                prtg_data['prtg_id_device'] = prtg_id_device
                return prtg_data
    except Exception as e:
        prtg_data = {
            'prtg_id_device': 'Error Devnet',
            'prtg_name_device': 'Error Devnet',
            'prtg_name_sensor': 'Error Devnet',
            'prtg_status': 'Error Devnet',
            'prtg_lastup': 'Error Devnet',
            'prtg_lastdown': 'Error Devnet'
        }
        logging.error(f"Error con el IP {ip}")
        logging.error(traceback.format_exc())
        logging.error(e)
        return prtg_data

def cisco_backup_data(cursor, ip):
    cisco_data = {}
    try:
        query = f"SELECT * FROM dcs.devices WHERE host = '{ip}' AND cisco_device_name <> 'Not Found' AND cisco_device_name <> 'Error Devnet' ORDER BY id DESC LIMIT 1"
        cursor.execute(query)
        results = cursor.fetchall()
        data_backup = [dict(zip(cursor.column_names, row)) for row in results]
        data_backup = data_backup[0]
        
        cisco_data['cisco_device_ip_adress'] = data_backup['cisco_device_ip']
        cisco_data['cisco_device_name'] = data_backup['cisco_device_name']
        cisco_data['cisco_client_port'] = data_backup['cisco_port']
        cisco_data['cisco_client_status'] = data_backup['cisco_status']
        cisco_data['cisco_device_reachability'] = data_backup['cisco_reachability']
        cisco_data['prtg_device_status'] = data_backup['cisco_status_device']
        cisco_data['cisco_client_mac_address'] = data_backup['cisco_mac_address']
        cisco_data['is_databackup'] = 'true'
        return cisco_data

    except:
        cisco_data['cisco_device_ip_adress'] = 'Not Found'
        cisco_data['cisco_device_name'] = 'Not Found'
        cisco_data['cisco_client_port'] = 'Not Found'
        cisco_data['cisco_client_status'] = 'Not Found'
        cisco_data['cisco_device_reachability'] = 'Not Found'
        cisco_data['prtg_device_status'] = 'Not Found'
        cisco_data['cisco_client_mac_address'] = 'Not Found'
        cisco_data['is_databackup'] = 'false'
        return cisco_data


def get_cisco_data(cursor, red, ip):

    cisco_data = { 'is_databackup': 'false' }
    
    try:
        URL_CISCO_GET_ID = os.getenv('URL_CISCO_IP').format(red=red, ip=ip)
        response_cisco_get_id = requests.get(URL_CISCO_GET_ID, verify=False).json()
        cisco_id_device = response_cisco_get_id.get('queryResponse', {'queryResponse':'Not Found'}).get('entityId', [{}])[0].get('$', 'Not Found')
        if cisco_id_device == 'Not Found':
            cisco_data = cisco_backup_data(cursor, ip)
            return cisco_data
        
        else:
            URL_CISCO_ID = os.getenv('URL_CISCO_ID').format(red=red, cisco_id_device=cisco_id_device)
            cisco_client_response = requests.get(URL_CISCO_ID, verify=False).json()
            cisco_client_data = cisco_client_response.get('queryResponse', {'queryResponse':'Not Found'}).get('entity', [{}])[0].get('clientsDTO', 'Not Found')
            
            if cisco_client_data == 'Not Found':
                cisco_data = cisco_backup_data(cursor, ip)
                return cisco_data

            cisco_data['cisco_client_port'] = cisco_client_data['clientInterface']
            cisco_data['cisco_client_status'] = cisco_client_data['status']
            cisco_data['cisco_client_mac_address'] = cisco_client_data['macAddress']['octets']  
            cisco_data['cisco_device_name'] = cisco_client_data['deviceName']
            cisco_data['cisco_device_ip_adress'] = cisco_client_data['deviceIpAddress']['address']

            #? Obtencion del estado del sensor ping en PRTG correspondiente al deviceIpAdress
            prtg_device_ip_url = os.getenv('URL_PRTG_IP').format(ip=cisco_data['cisco_device_ip_adress'])
            prtg_device_ip_response = requests.get(prtg_device_ip_url, verify=False).json()
            if prtg_device_ip_response['treesize'] == 0:
                cisco_data['prtg_device_status'] = 'Not Found'
            
            else:
                prtg_device_id = prtg_device_ip_response['devices'][0]['objid']
                prtg_device_id_url = os.getenv('URL_PRTG_ID').format(id_device=prtg_device_id)
                prtg_device_status_response = requests.get(prtg_device_id_url, verify=False).json()
                cisco_data['prtg_device_status'] = prtg_device_status_response['sensors'][0]['status']
                
            CISCO_DEVICE_IP_URL = os.getenv('URL_CISCO_IP_DEVICE').format(red=red, ip=cisco_data['cisco_device_ip_adress'])
            cisco_device_ip_response = requests.get(CISCO_DEVICE_IP_URL, verify=False).json()
            cisco_device_id = cisco_device_ip_response.get('queryResponse', {'queryResponse':'Not Found'}).get('entityId', [{}])[0].get('$', 'Not Found')
            
            CISCO_DEVICE_ID_URL = os.getenv('URL_CISCO_ID_DEVICE').format(red=red, id_device=cisco_device_id)
            cisco_device_id_response = requests.get(CISCO_DEVICE_ID_URL, verify=False).json()
            cisco_data['cisco_device_reachability'] = cisco_device_id_response.get('queryResponse', {'queryResponse':'Not Found'}).get('entity', [{}])[0].get('devicesDTO', {}).get('reachability', 'Not Found')

    except Exception as e:
        cisco_data = {
            'cisco_device_ip_adress': 'Error Devnet',
            'cisco_device_name': 'Error Devnet',
            'cisco_client_port': 'Error Devnet',
            'cisco_client_status': 'Error Devnet',
            'cisco_device_reachability': 'Error Devnet',
            'prtg_device_status': 'Error Devnet',
            'cisco_client_mac_address': 'Error Devnet',
            'is_databackup': 'false'
        }
        logging.error(f"Error con el IP {ip}")
        logging.error(traceback.format_exc())
        logging.error(e)
        return cisco_data
    
    return cisco_data
                
                
def bucle(scheduler):
    get_devices_data()
    scheduler.enter(300, 1, bucle, (scheduler,))

if __name__ == '__main__':
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()