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

        tuples_data = parse_table(output)
        
        lista_de_diccionarios = []

        # Iterar sobre cada tupla y crear un diccionario
        for tupla in tuples_data:
            diccionario = {
                'name': tupla[0],
                'model': tupla[2],
                'ip': tupla[7],
                'state': tupla[8],
                'location': tupla[-1].strip()  # Eliminar espacios en blanco y retorno de carro
            }
            lista_de_diccionarios.append(diccionario)
            
        return lista_de_diccionarios

    except Exception as e:
        logging.error("Error en funcion EIRGP")
        logging.error(e)
        logging.error(traceback.format_exc())

def parse_table(output):
    pattern = re.compile(r'(\S+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)')
    table_data = []

    # Dividir las líneas del output
    lines = output.split('\n')

    # Iterar sobre cada línea y aplicar el patrón de expresión regular
    for line in lines:
        match = pattern.match(line)
        if match:
            # Agregar los grupos coincidentes como una fila en la tabla
            table_data.append(match.groups())
    return table_data


# tuples_data = parse_table(res)
# # print(len(tuples_data))

# # Lista para almacenar los diccionarios resultantes
# lista_de_diccionarios = []

# # Iterar sobre cada tupla y crear un diccionario
# for tupla in tuples_data:
#     diccionario = {
#         'name': tupla[0],
#         'model': tupla[2],
#         'ip': tupla[7],
#         'state': tupla[8],
#         'location': tupla[-1].strip()  # Eliminar espacios en blanco y retorno de carro
#     }
#     lista_de_diccionarios.append(diccionario)

# # Imprimir la lista de diccionarios resultante
# print(len(lista_de_diccionarios))
# print(lista_de_diccionarios)

# Imprimir los datos de la tabla
# for row in table_data:
#     print(row)