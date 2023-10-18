import paramiko
import time
import re
import logging, traceback

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(file_handler)


def vdom_connection(host, vdom, username, password, ssh_timeout=45):
    try:
        # Crear una instancia SSHClient de Paramiko
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        
        # Conectar al dispositivo
        client.connect(hostname=host, port=2221, username=username, password=password, timeout=ssh_timeout)

        # Abrir un canal SSH
        channel = client.invoke_shell()
    
        # Enviar el comando 'config vdom'
        channel.send("config vdom\n")
        time.sleep(1)  # Esperar para que el comando se procese

        # Enviar otros comandos dentro del contexto 'config vdom'
        commands = [
            f"edit {vdom}\n",
            "diagnose sys sdwan health-check Check_Internet\n",
            "exit\n"  # Salir del contexto 'config vdom'
        ]

        for command in commands:
            channel.send(command)
            time.sleep(1)  # Esperar para que el comando se procese

        # Recopilar la salida
        output = ""
        while channel.recv_ready():
            output += channel.recv(1024).decode('utf-8')
            
        # Cerrar el canal y la conexión
        channel.close()
        client.close()
        
        # Analizar la salida con regex
        pattern = r'Seq\(\d+ ([^\)]+)\): state\(([^)]+)\), packet-loss\(([^)]+)\)(?: latency\(([^)]+)\), jitter\(([^)]+)\))?.*'
        matches = re.findall(pattern, output)
        
        result = []
        
        for match in matches:
            try:
                canal = match[0]
                state = match[1]
                packet_loss = match[2]
                packet_loss = packet_loss.replace("%", "")
                latency = match[3] if match[3] else "Not Found"
                jitter = match[4] if match[4] else "Not Found"

                result.append((canal, state, packet_loss, latency, jitter))
                
            except IndexError:
                continue


        if not result:
            result = [('Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found')]

        return result
    except Exception as e:
        logging.error("Error en el archivo VDOM funcion vdom_connection")
        logging.error(e)
        logging.error(traceback.format_exc())
        result = [('Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found')]
        return result


def number_users_vdom(host, vdom, username, password, ssh_timeout=45):
    client = None
    channel = None
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        client.connect(hostname=host, port=2221, username=username, password=password, timeout=ssh_timeout)

        channel = client.invoke_shell()

        channel.send("config vdom\n")
        time.sleep(1)

        commands = [
            f"edit {vdom}\n",
            "diagnose debug authd fsso list | grep 'Total number'\n",
            "exit\n"
        ]

        for command in commands:
            channel.send(command)
            time.sleep(1)

        output = ""
        while channel.recv_ready():
            output += channel.recv(1024).decode('utf-8')

        # Usamos una expresión regular para encontrar el número en la última línea
        result = re.search(r'Total number of logons listed:\s*(\d+)', output)

        if result:
            # Si se encuentra el número, lo extraemos
            number = int(result.group(1))
        else:
            number = 'Not Found'
        return number

    except TimeoutError as e:
        logging.error("Error en el archivo VDOM funcion number_users_vdom")
        logging.error(e)
        logging.error(traceback.format_exc())
        return "Not Found"
    finally:
        if channel:
            channel.close()
        if client:
            client.close()

