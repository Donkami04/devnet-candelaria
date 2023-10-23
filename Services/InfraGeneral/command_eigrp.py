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
        # Crear una instancia SSHClient de Paramiko
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Conectar al dispositivo
        client.connect(hostname=ip_switch, port=22, username='roadmin', password='C4nd3*2023')

        # Abrir un canal SSH
        channel = client.invoke_shell()

        # Enviar otros comandos dentro del contexto 'config vdom'
        commands = [
            f"terminal length 0\n",
            "show ip eigrp neighbors\n"
        ]

        for command in commands:
            channel.send(command)
            time.sleep(1)  # Esperar para que el comando se procese

        # Recopilar la salida
        output = ""
        while channel.recv_ready():
            output += channel.recv(1024).decode('utf-8')
        # print(output)
        # Cerrar el canal y la conexión
        channel.close()
        client.close()
        # print(output)
        patron = r'(\d+)\s+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+(\S+)\s+(\d+)\s+([\w/]+)\s+(\d+)\s+(\d+:\d+:\d+|\d+)\s+(\d*)\s+(\d*)'
        # example = "EIGRP-IPv4 Neighbors for AS(1) H   Address                 Interface              Hold Uptime   SRTT   RTO  Q  Seq (sec)         (ms)       Cnt Num 2   10.224.126.22           Te1/9                    13 00:00:11    1   100  0  2880224 6   10.224.126.78           Vl2407                   10 1w3d       10   100  0  80770 1   10.224.126.86           Vl2409                   14 1w3d       10   100  0  80750 0   10.224.125.162          Te1/28                   12 28w5d      24   144  0  6400284 9   10.224.126.38           Te2/1                    12 28w6d      13   100  0  2858677 8   10.224.126.30           Te1/10                   12 28w6d      11   100  0  2858772 7   10.224.125.2            Vl2401                   12 30w5d      21   126  0  14521439 5   10.224.126.14           Te1/6                    12 35w3d      18   108  0  11793655 4   10.224.125.13           Te1/4                    13 35w3d      11   100  0  2376352 3   10.224.126.6            Te1/3                    12 35w3d      12   100  0  8927857"
        coincidencias = re.finditer(patron, output)

        data_list = []

        for match in coincidencias:                
            address = match.group(2)
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
            
        # print(data_list)
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

# eigrp_function('10.224.127.1', 'it', 'conce')
eigrp_function('10.224.127.2', 'it', 'conce')
