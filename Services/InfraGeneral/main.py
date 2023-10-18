import xml.etree.ElementTree as ET
import requests, warnings, os, datetime, time, calendar, mysql.connector, logging, traceback, sched
from dotenv import load_dotenv
from config import database

warnings.filterwarnings('ignore', message='Unverified HTTPS request')

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
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

def core_1():
    load_dotenv()
    # URL_PRTG_GET_ID_WITH_IP = os.getenv("URL_PRTG_GET_ID_WITH_IP")
    # response_1 = requests.get(URL_PRTG_GET_ID_WITH_IP, verify=False).json()
    
    url_interfaces = os.getenv("URL_PRTG_GET_STATUS_INTERFACES")
    response_interfaces = requests.get(url_interfaces, verify=False).json()
    interfaces = response_interfaces.get('sensors', [{'name': 'No Devices Found', 'status': 'Down'}])
    if interfaces == []:
        interfaces = [{'name': 'No Devices Found', 'status': 'Down'}]
    print(interfaces)
    


core_1()

# def bucle(scheduler):
#     get_uptime()
#     scheduler.enter(7200, 1, bucle, (scheduler,))

# if __name__ == '__main__':
#     s = sched.scheduler(time.time, time.sleep)
#     s.enter(0, 1, bucle, (s,))
#     s.run()