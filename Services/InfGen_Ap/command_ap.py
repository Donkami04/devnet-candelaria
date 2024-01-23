import paramiko
import time
import re
import logging
import traceback

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(file_handler)
paramiko_logger = logging.getLogger("paramiko")
paramiko_logger.setLevel(logging.WARNING)

def ap_function(ip_switch, red, name):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(hostname=ip_switch, port=22, username='roadmin', password='C4nd3*2023')
        channel = client.invoke_shell()

        commands = [
            f"terminal length 0\n",
            "show ap summary\n"
        ]

        for command in commands:
            channel.send(command)
            time.sleep(2)

        output = ""
        while channel.recv_ready():
            output += channel.recv(1024).decode('utf-8')
        channel.close()
        client.close()
        print(output)
        return output

    except Exception as e:
        logging.error("Error en funcion EIRGP")
        logging.error(e)
        logging.error(traceback.format_exc())

res = ap_function("10.224.127.156", "it", "WLC 9800 NEGOCIO")

