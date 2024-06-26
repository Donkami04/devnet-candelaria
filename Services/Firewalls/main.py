import mysql.connector, warnings, time, sched, datetime, os, re, traceback, logging, requests, paramiko
import netmiko
from netmiko import ConnectHandler
from dotenv import load_dotenv
from config import database
from vdom import vdom_connection, number_users_vdom
from save_bd import save_bd
from update_fail_datetime import update_fail_datetime

warnings.filterwarnings('ignore', message='Unverified HTTPS request')
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(file_handler)

load_dotenv()


def fw_status():
    env = os.getenv('ENVIRONMENT')

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

    cursor = mydb.cursor()
    net_connect = None
    try:
        USER = os.getenv('NETMIKO_USER')
        PASSWORD = os.getenv('NETMIKO_PASSWORD')
        
        query = "SELECT * FROM dcs.data_firewalls"
        cursor.execute(query)
        column_names = [column[0] for column in cursor.description]
        firewall_list = []
        for row in cursor:
            row_dict = {}
            for i in range(len(column_names)):
                row_dict[column_names[i]] = row[i]
            firewall_list.append(row_dict)
        
            
        # Obtenemos los datos de la utima consulta
        query = "SELECT * FROM dcs.firewalls"
        cursor.execute(query)
        last_column_names = [column[0] for column in cursor.description]
        last_firewall_list = []
        for row in cursor:
            row_dict = {}
            for i in range(len(last_column_names)):
                row_dict[last_column_names[i]] = row[i]
            last_firewall_list.append(row_dict)
            

        for fw in firewall_list:
            now = datetime.datetime.now()
            fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
            fecha_y_hora = str(fecha_y_hora)
            
            host = fw.get('ip')
            name = fw.get('name')
            link = fw.get('link')
            vdom = fw.get('vdom')
            gateway = fw.get('gateway')
            ubication = fw.get('ubication')
            channel = fw.get('channel')
            logging.info(f'Corriendo : {host} - {name} - {channel}')
            status_gateway = get_prtg_status(gateway)
            
            if ubication == 'corporate' and vdom != 'N/A':
                num_users = number_users_vdom(host, vdom, USER, PASSWORD)
                # print(f"Numero de usuarios conectados desde VDOM DonKami: {num_users}")
                
            if ubication == 'corporate' and vdom == 'N/A':
                num_users = number_users(host, USER, PASSWORD)
                # print(f"Numero de usuarios conectados desde NETMIKO DonKami: {num_users}")
                
            if ubication == 'community':
                num_users = 'N/A'
            
            try:
                if vdom != 'N/A':
                    results = vdom_connection(host, vdom, USER, PASSWORD)
                    for canal, state, packet_loss, latency, jitter in results:
                        if canal == channel or canal == 'Not Found':
                            failed_before = check_failed_before(cursor, name, channel)
                            
                            data = {
                                "name": name,
                                "ip": host,
                                "canal": canal,
                                "num_users": num_users,
                                "state": state,
                                "packet_loss": packet_loss,
                                "latency": latency,
                                "jitter": jitter,
                                "failed_before": failed_before,
                                "datetime": fecha_y_hora,
                                "link": link,
                                "gateway": gateway,
                                "ubication": ubication,
                                "status_gateway": status_gateway
                            }
                            
                            update_fail_datetime(last_firewall_list, data)
                            save_bd(data)
                            
                            # query_historic = "INSERT INTO dcs.historic_firewalls (`fw`, `ip`, `canal`, `num_users`, `state`, `packet_loss`, `latency`, `jitter`, `failed_before`, `datetime`, `link`, `gateway`, `ubication`, `status_gateway`)"
                            # value_historic = f"VALUES ('{name}', '{host}', '{canal}', '{num_users}', '{state}', '{packet_loss}', '{latency}', '{jitter}', '{failed_before}', '{fecha_y_hora}', '{link}', '{gateway}', '{ubication}', '{status_gateway}')"
                            # cursor.execute(query_historic + value_historic)
                            # mydb.commit()
                    
                else:
                    try:
                        network_device_list = {
                            "host": host,
                            "username": USER,
                            "password": PASSWORD,
                            "device_type": "fortinet",
                            "port": 2221,
                            "timeout": 10000,
                        }

                        net_connect = ConnectHandler(**network_device_list)
                        output = net_connect.send_command("diagnose sys sdwan health-check Check_Internet")
                        net_connect.disconnect()
                        
                        if 'Health Check' in output:
                            pattern = r'Seq\(\d+ ([^\)]+)\): state\(([^)]+)\), packet-loss\(([^)]+)\)(?: latency\(([^)]+)\), jitter\(([^)]+)\))?.*'
                            matches = re.findall(pattern, output)
                            for match in matches:
                                try:
                                    canal = match[0]
                                    if canal == channel:
                                        state = match[1]
                                        packet_loss = match[2]
                                        packet_loss = packet_loss.replace("%", "")
                                        latency = match[3] if match[3] else "Not Found"
                                        jitter = match[4] if match[4] else "Not Found"
                                        failed_before = check_failed_before(cursor, name, channel)
                                        
                                        data = {
                                            "name": name,
                                            "ip": host,
                                            "canal": canal,
                                            "num_users": num_users,
                                            "state": state,
                                            "packet_loss": packet_loss,
                                            "latency": latency,
                                            "jitter": jitter,
                                            "failed_before": failed_before,
                                            "datetime": fecha_y_hora,
                                            "link": link,
                                            "gateway": gateway,
                                            "ubication": ubication,
                                            "status_gateway": status_gateway
                                        }
                                        
                                        update_fail_datetime(last_firewall_list, data)
                                        save_bd(data)
                                        # query = "INSERT INTO dcs.firewalls (`fw`, `ip`, `canal`, `num_users`, `state`, `packet_loss`, `latency`, `jitter`, `failed_before`, `datetime`, `link`, `gateway`, `ubication`, `status_gateway`)"
                                        # value = f"VALUES ('{name}', '{host}', '{canal}', '{num_users}', '{state}', '{packet_loss}', '{latency}', '{jitter}', '{failed_before}', '{fecha_y_hora}', '{link}', '{gateway}', '{ubication}', '{status_gateway}')"
                                        # cursor.execute(query + value)
                                        # mydb.commit()
                                        
                                        # query = "INSERT INTO dcs.historic_firewalls (`fw`, `ip`, `canal`, `num_users`, `state`, `packet_loss`, `latency`, `jitter`, `failed_before`, `datetime`, `link`, `gateway`, `ubication`, `status_gateway`)"
                                        # value = f"VALUES ('{name}', '{host}', '{canal}', '{num_users}', '{state}', '{packet_loss}', '{latency}', '{jitter}', '{failed_before}', '{fecha_y_hora}', '{link}', '{gateway}', '{ubication}', '{status_gateway}')"
                                        # cursor.execute(query + value)
                                        # mydb.commit()

                                except:
                                    logging.error(f"Error en la expresión regular Health Check - FW {host}")
                                    logging.error(traceback.format_exc())
                                    save_bd_error(last_firewall_list, cursor, mydb, host, channel, num_users, name, fecha_y_hora, link, gateway, ubication, status_gateway)
                    
                    except netmiko.NetMikoTimeoutException as timeout_error:
                        logging.error("ENTRO AL NETMIKO ERRRO")
                                    
                    else:
                        logging.error(f"No se encontraron las palabras 'Health Check - FW {host}'")
                        logging.error(traceback.format_exc())
                        save_bd_error(last_firewall_list, cursor, mydb, host, channel, num_users, name, fecha_y_hora, link, gateway, ubication, status_gateway)
                                    
            except Exception as e:
                if net_connect:
                    net_connect.disconnect()
                logging.error(f"Error en el segundo Try, FW {host}")
                logging.error(e)
                logging.error(traceback.format_exc())
                save_bd_error(last_firewall_list, cursor, mydb, host, channel, num_users, name, fecha_y_hora, link, gateway, ubication, status_gateway)
                
                    
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO dcs.fechas_consultas_fw (`ultima_consulta`, `estado`) VALUES ('{fecha_y_hora}', 'OK')")
        mydb.commit()
        cursor.close()
    
        logging.info("Terminado")
    
    except Exception as e:
        # if net_connect:
        #     net_connect.disconnect()
        logging.error(f"Error de bajo nivel, posible error en Netmiko")
        logging.error(e)
        logging.error(traceback.format_exc())
        
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        
        cursor.execute(f"INSERT INTO dcs.fechas_consultas_fw (`ultima_consulta`, `estado`) VALUES ('{fecha_y_hora}', 'ERROR')")
        mydb.commit()
        cursor.close()
        

def get_prtg_status(ip_gateway):
    url_prtg_ip = os.getenv('URL_PRTG_IP').format(ip=ip_gateway)
    response_1 = requests.get(url_prtg_ip, verify=False).json()
    devices = response_1.get('devices', [])

    if devices:
        id_device = devices[0].get('objid', 'Not Found')
    else:
        id_device = 'Not Found'
        return 'Not Found'
        
    url_prtg_id = os.getenv('URL_PRTG_ID').format(id_device=id_device)
    response_2 = requests.get(url_prtg_id, verify=False).json()
    status = response_2.get('sensors', [{}])[0].get('status', 'Not Found')
    
    return status

def save_bd_error(last_firewall_list, cursor, mydb, host, channel, num_users, name, fecha_y_hora, link, gateway, ubication, status_gateway):
    canal = 'Not Found'
    state = 'Not Found'
    packet_loss = 'Not Found'
    latency = 'Not Found'
    jitter = 'Not Found'
    failed_before = check_failed_before(cursor, name, channel)
    
    data = {    
        "name": name,
        "ip": host,
        "canal": canal,
        "num_users": num_users,
        "state": state,
        "packet_loss": packet_loss,
        "latency": latency,
        "jitter": jitter,
        "failed_before": failed_before,
        "datetime": fecha_y_hora,
        "link": link,
        "gateway": gateway,
        "ubication": ubication,
        "status_gateway": status_gateway
    }
    
    update_fail_datetime(last_firewall_list, data)
    save_bd(data)

    # query = "INSERT INTO dcs.firewalls (`fw`, `ip`, `canal`, `num_users`, `state`, `packet_loss`, `latency`, `jitter`, `failed_before`, `datetime`, `link`, `gateway`, `ubication`, `status_gateway`)"
    # value = f"VALUES ('{name}', '{host}',  '{canal}', '{num_users}', '{state}', '{packet_loss}', '{latency}', '{jitter}', '{failed_before}', '{fecha_y_hora}', '{link}', '{gateway}', '{ubication}', '{status_gateway}')"
    # cursor.execute(query + value)
    # mydb.commit()

def number_users(host, username, password):
    try:
        network_device_list = {
            "host": host,
            "username": username,
            "password": password,
            "device_type": "fortinet",
            "port": 2221,
        }
        
        net_connect = ConnectHandler(**network_device_list)
        output = net_connect.send_command("diagnose debug authd fsso list | grep 'Total number'")
        net_connect.disconnect()
        match = re.search(r'\b(\d+)\b', output)
        if match:
            number = match.group(0)  # Cambia group(1) a group(0)
            return number
        else:
            number = 'Not Found'
            return number
        
    except Exception as e:
        # if net_connect:
        #     net_connect.disconnect()
        logging.error(f"Error de bajo nivel, posible error en Netmiko")
        logging.error(e)
        
    
def check_failed_before(cursor, name, channel):
    try:
        query = f"SELECT * FROM dcs.firewalls WHERE fw = '{name}' AND canal = '{channel}' AND state = 'dead' AND datetime >= NOW() - INTERVAL 24 HOUR ORDER BY datetime DESC LIMIT 1"
        cursor.execute(query)
        row = cursor.fetchone()
        if row:
            return 'Si'
        else:
            return 'No'
            
    except Exception as e:
        logging.error(e)
        logging.error(f"Error en la consulta a la BD check_failed_before {name}")
        return 'Error'
    

def bucle(scheduler):
    fw_status()
    scheduler.enter(300, 1, bucle, (scheduler,))

if __name__ == '__main__':
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()
