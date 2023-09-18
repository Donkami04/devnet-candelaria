import warnings, requests, os, time, traceback, re, sched, datetime
import mysql.connector
from dotenv import load_dotenv
from config import database

# Esto evita que las respuestas de las API tengan warnings.
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

def switches():
    
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

    # Realizar una consulta para leer información de la base de datos
    query = "SELECT * FROM dcs.data_switches"
    cursor.execute(query)

    # Obtener los nombres de las columnas
    column_names = [column[0] for column in cursor.description]

    # Convertir los resultados a una lista de diccionarios
    allSwitches = []
    for row in cursor:
        row_dict = {}
        for i in range(len(column_names)):
            row_dict[column_names[i]] = row[i]
        allSwitches.append(row_dict)
        

    print('Inicia bucle de consulta de Switches')
    try:
        load_dotenv()
        for switch in allSwitches:
            ip = switch['ip']
            group = switch['group']
            print(ip)
            
            # Inicia bloque de consulta a la API PRTG
            URL_PRTG_IP = os.getenv('URL_PRTG_IP').format(ip=ip)
            prtg_ip_response = requests.get(URL_PRTG_IP, verify=False).json()
            if len(prtg_ip_response['devices']) == 0:
                ip=ip,
                name=switch['dispositivo'],
                status='Not Found',
                last_up='Not Found',
                last_down='Not Found',
                
            else:
                id_device_prtg = prtg_ip_response['devices'][0]['objid']
                #! Pendiente definir URL para UPS
                URL_PRTG_ID = os.getenv('URL_PRTG_ID').format(id_device=id_device_prtg)
                prtg_data = requests.get(URL_PRTG_ID, verify=False).json()
                sensor = prtg_data['sensors'][0]
                status = sensor['status']
                name = sensor['device']
                last_up = sensor['lastup']
                last_down = sensor['lastdown']
                
                patron = re.compile(r'<.*?>') # Se usa para formatear el last_up y last_down
                last_up =  re.sub(patron, '', last_up)
                last_down =  re.sub(patron, '', last_down)

            # Inicia bloque para consultar datos a la API CISCO PRIME
            # Si no hay ID se define status_cisco_device como Not Found.
            URL_CISCO_IP_DEVICE = os.getenv('URL_CISCO_IP_DEVICE').format(ip=ip)
            cisco_ip_response = requests.get(URL_CISCO_IP_DEVICE, verify=False).json()
            if cisco_ip_response['queryResponse']['@count'] == 0:
                status_cisco_device='Not Found'
                
            else:
                cisco_id_client = cisco_ip_response['queryResponse']['entityId'][0]['$']
                URL_CISCO_ID_DEVICE = os.getenv('URL_CISCO_ID_DEVICE').format(id_device=cisco_id_client)
                cisco_data_device = requests.get(URL_CISCO_ID_DEVICE, verify=False).json()
                status_cisco_device = cisco_data_device['queryResponse']['entity'][0]['devicesDTO']['reachability']
                
            sql = f"INSERT INTO switches (dispositivo, ip, tipo, status_prtg, lastup_prtg, lastdown_prtg, reachability, ups1, ups2, status_ups1, status_ups2, `group`)"
            val = f"VALUES ('{name}', '{ip}', 'Switch', '{status}', '{last_up}', '{last_down}', '{status_cisco_device}', 'NA', 'NA', 'NA', 'NA', '{group}')"
            # val = (name, ip, 'Switch', status, last_up, last_down, status_cisco_device, 'NA', 'NA', 'NA', 'NA', group)
            consulta = f"{sql} {val}"
            cursor.execute(consulta)

            mydb.commit()
            
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)

        sql_datetime = f"INSERT INTO fechas_consultas_switches (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'OK')"
        cursor.execute(sql_datetime)
        mydb.commit()   
        
        cursor.close()
        mydb.close()
        
        # with open("/app/DCS-Candelaria/Services/Switches/logs.txt", "a") as archivo:
        with open("/app/logs.txt", "a") as archivo:
            archivo.write(str(fecha_y_hora) + '\n')
            
    except Exception:
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        sql_datetime = f"INSERT INTO fechas_consultas_switches (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')"
        cursor.execute(sql_datetime)
        mydb.commit()
        
        # with open("/home/donkami/Sona/APIS/DCS-Candelaria/Services/Switches/logs.txt", "a") as archivo:
        with open("/app/logs.txt", "a") as archivo:
            archivo.write('Fecha y hora del error: ' + str(fecha_y_hora) + ' Dispositivo del error ---> ' + str(ip) + '\n')
            archivo.write(traceback.format_exc())
            archivo.write("\n")
        


def bucle(scheduler):
    switches()
    scheduler.enter(300, 1, bucle, (scheduler,))

if __name__ == '__main__':
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()


