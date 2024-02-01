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

def ap_function(ip_switch):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(hostname=ip_switch, port=22, username='roadmin', password='C4nd3*2023')
        channel = client.invoke_shell()

        commands = [
            f"terminal length 0\n",
            "show wireless stats ap join summary\n"
        ]

        output_list = []  # Lista para acumular la salida de cada bloque
        for command in commands:
            channel.send(command)
            time.sleep(2)

        output = ""
        while channel.recv_ready():
            output += channel.recv(1024).decode('utf-8')
        channel.close()
        client.close()
        blocks = re.split('-{100,}', output)

        # Procesar cada bloque
        for block in blocks:
            ap_list = process_block(block.strip())
            output_list.extend(ap_list)

        # Eliminar la parte no deseada del valor 'Last Disconnect Reason'
        for ap_dict in output_list:
            if 'last_disconnect_reason' in ap_dict and 'Image-Download' in ap_dict['last_disconnect_reason']:
                ap_dict['last_disconnect_reason'] = ap_dict['last_disconnect_reason'].replace('Image-Download', '').strip()
            if 'last_disconnect_reason' in ap_dict and 'Dtls-Handshake' in ap_dict['last_disconnect_reason']:
                ap_dict['last_disconnect_reason'] = ap_dict['last_disconnect_reason'].replace('Dtls-Handshake', '').strip()
                
        return output_list

    except Exception as e:
        logging.error("Error en funcion EIRGP")
        logging.error(e)
        logging.error(traceback.format_exc())

def process_block(block):
    lines = block.split('\n')
    ap_list = []

    ap_info_pattern = re.compile(r'(?P<name>[\w.-]+)\s+(?P<ip>\d+\.\d+\.\d+\.\d+)\s+(?P<status>Not\s+Joined|Joined)\s+(?P<reason>[\w\s-]+)')

    for line in lines:
        match = ap_info_pattern.search(line)
        if match:
            # Eliminar 'Run' y espacios en blanco del atributo 'Last Disconnect Reason'
            disconnect_reason = match.group('reason').replace('Run', '').strip()
            ap_dict = {
                'name': match.group('name'),
                'ip': match.group('ip'),
                'status': match.group('status'),
                'last_disconnect_reason': disconnect_reason
            }
            ap_list.append(ap_dict)

    return ap_list

# Ejemplo de uso:
result_list = ap_function("10.224.127.156")

# # Imprimir la lista completa
# for ap_dict in result_list:
#     print(ap_dict)
