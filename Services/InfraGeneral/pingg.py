import subprocess

def ping(host):
    command = ['ping', '-c', '2', host]  # Cambia el número 4 al número de intentos que desees
    try:
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return "Up"
    except subprocess.CalledProcessError as e:

        return "Down"

host_a_pinguear = "10.224.127.1"
resultado = ping(host_a_pinguear)
print(resultado)
