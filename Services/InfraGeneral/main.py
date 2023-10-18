import xml.etree.ElementTree as ET
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

# load_dotenv()
# env = os.getenv('ENVIRONMENT')
# if env == 'local':
#     mydb = mysql.connector.connect(
#     host=database['local']['DB_HOST'],
#     user=database['local']['DB_USER'],
#     password=database['local']['DB_PASSWORD'],
#     database=database['local']['DB_DATABASE']
#     )

# else:
#     mydb = mysql.connector.connect(
#     host=database['production']['DB_HOST'],
#     user=database['production']['DB_USER'],
#     password=database['production']['DB_PASSWORD'],
#     database=database['production']['DB_DATABASE']
#     )


# cursor = mydb.cursor()


load_dotenv()

def core1():
    pass


def core1_interfaces():
    try:
        #! Para obtener el valor fijo de numero de filas de la tabla
        #! puedo hacer el llamado de la API PRTG desde el servidor de express
        url_interfaces = os.getenv("URL_PRTG_GET_STATUS_INTERFACES")
        response_interfaces = requests.get(url_interfaces, verify=False).json()
        interfaces = response_interfaces.get(
            "sensors", [{"name": "No Devices Found", "status": "Down"}]
        )
        if interfaces == []:
            interfaces = [{"name": "No Devices Found", "status": "Down"}]
            
        return interfaces
            
    except:
        pass
    # up_Interfaces = [interface for interface in interfaces if 'Up' in interface['status']]
    # down_Interfaces = [interface for interface in interfaces if 'Down' in interface['status']]

def system_health():
    url_system_health = os.getenv("URL_PRTG_GET_STATUS_SYSTEM_HEALTH")
    response_system_health = requests.get(url_system_health, verify=False).json()
    print(response_system_health)
    
    
system_health()


# def bucle(scheduler):
#     get_uptime()
#     scheduler.enter(7200, 1, bucle, (scheduler,))

# if __name__ == '__main__':
#     s = sched.scheduler(time.time, time.sleep)
#     s.enter(0, 1, bucle, (s,))

#     s.run()

