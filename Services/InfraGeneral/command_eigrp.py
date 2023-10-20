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
        
        patron = r'\d+\s+([\d.]+)\s+(\S+)\s+(\d+)\s+([\w/]+)\s+(\d+)\s+(\w+)\s+(\d+)\s+(\d+)'

        # Buscar todas las coincidencias en el texto
        coincidencias = re.findall(patron, output)

        # Crear listas vacías para almacenar los valores de las columnas
        address = []
        # interface = []
        # hold_uptime = []
        # srtt = []
        # rto = []
        # q = []
        # seq = []

        # Iterar a través de las coincidencias y almacenar los valores en las listas
        for match in coincidencias:
            address.append(match[0])
            # interface.append(match[1])
            # hold_uptime.append(match[2])
            # srtt.append(match[3])
            # rto.append(match[4])
            # q.append(match[5])
            # seq.append(match[6])
            
        # Crear una lista de diccionarios
        data_list = []

        # Iterar a través de las listas y crear un diccionario para cada conjunto de valores
        for i in range(len(address)):
            data = {
                'ip_neighbor': address[i],
                'ip_switch': ip_switch,
                'neighbor': 'eigrp',
                'red':red,
                'name':name
                # 'Interface': interface[i],
                # 'Hold Uptime': srtt[i], #! srtt Corresponde al Hold Uptime despues del regex
                # 'SRTT': srtt[i],
                # 'RTO': rto[i],
                # 'Q': q[i],
                # 'Seq': seq[i]
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
            'red':red,
            'name':name
        }]

        return data