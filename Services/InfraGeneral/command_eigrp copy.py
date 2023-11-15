import paramiko
import time
import re
import logging, traceback

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(file_handler)
paramiko_logger = logging.getLogger("paramiko")
paramiko_logger.setLevel(logging.WARNING)

def eigrp_function(ip_switch, red, name):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(hostname=ip_switch, port=22, username='roadmin', password='C4nd3*2023')
        channel = client.invoke_shell()

        commands = [
            f"terminal length 0\n",
            "show ip eigrp neighbors\n"
        ]

        for command in commands:
            channel.send(command)
            time.sleep(1)

        output = ""
        while channel.recv_ready():
            output += channel.recv(1024).decode('utf-8')
        channel.close()
        client.close()
        print(output)
        patron = r'(\d+)\s+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+(\S+)\s+(\d+)\s+([\w/]+)\s+(\d+)\s+(\d+:\d+:\d+|\d+)\s+(\d*)\s+(\d*)'
        coincidencias = re.finditer(patron, output)

        data_list = []

        for match in coincidencias:                
            address = match.group(2)
            # interface = match.group(1)
            # print(interface)
            data = {
                'ip_neighbor': address,
                'ip_switch': ip_switch,
                'neighbor': 'eigrp',
                'red': red,
                'name': name
            }
            data_list.append(data)

        if "10.224.126.22" in output:
            data = {
                'ip_neighbor': "10.224.126.22",
                'ip_switch': ip_switch,
                'neighbor': 'eigrp',
                'red': red,
                'name': name     
            }
            data_list.append(data)    
            
        return data_list

    except Exception as e:
        logging.error("Error en funcion EIRGP")
        logging.error(e)
        logging.error(traceback.format_exc())
        data = [{
            'ip_neighbor': 'Not Found / Error', 
            'ip_switch': ip_switch,
            'neighbor': 'eigrp',
            'red': red,
            'name': name
        }]

        return data
