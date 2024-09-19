import logging
import traceback
from netmiko import ConnectHandler

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

file_handler = logging.FileHandler("issues.log")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
logging.getLogger().addHandler(file_handler)
paramiko_logger = logging.getLogger("paramiko")
paramiko_logger.setLevel(logging.WARNING)


def reset_base(ip_base):

    try:
        logging.info(f"Iniciando Reinicio {ip_base}")
        device = {
            "device_type": "cisco_ios_telnet",
            "host": ip_base,
            "username": "admin",
            "password": "netman",
            "port": 23,
        }
        
        # Iniciar la conexión TELNET
        with ConnectHandler(**device) as telnet:
            output = telnet.send_command("reboot")
            telnet.disconnect()
            logging.info(f"Output {output}")
            logging.info(f"Base reiniciada en {ip_base}")
        
        return "OK", "OK"
            
    except Exception as e:
        logging.error("Error en funcion Reset_Base")
        logging.error(e)
        logging.error(traceback.format_exc())
        return "ERROR", e
        
# reset_base("10.224.89.10")