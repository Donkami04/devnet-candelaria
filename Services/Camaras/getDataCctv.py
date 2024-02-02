import requests
import os
from dotenv import load_dotenv
import csv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Obtener las credenciales de nombre de usuario y contraseña desde las variables de entorno
username = os.getenv('CCTV_USER')
password = os.getenv('CCT_PASS')

# URL de la API
api_cctv = os.getenv('CCTV_BASE_URL_AP')

# Configurar la autenticación básica
auth = (username, password)

# Realizar la solicitud con autenticación básica
data_cameras = requests.get(api_cctv, auth=auth).json()

# Verificar el código de estado de la respuesta

# Convertir la respuesta a un objeto JSON


# Nombre del archivo CSV
nombre_archivo = "datos.csv"

# Abrir el archivo CSV en modo de escritura
with open(nombre_archivo, mode='w', newline='') as archivo_csv:
    # Crear el escritor CSV
    escritor_csv = csv.writer(archivo_csv)

    # Escribir la primera fila con los encabezados
    escritor_csv.writerow(['enabled', 'valid', 'url', 'id'])

    # Iterar sobre cada diccionario en la lista y escribir las celdas correspondientes
    for diccionario in data_cameras["data"]:
        fila = [diccionario['status']['enabled'], diccionario['status']['valid'], diccionario['url'], diccionario['id']]
        escritor_csv.writerow(fila)
        # print(diccionario['status']['enabled'])
        # print(diccionario['status']['valid'])
        # print(diccionario['url'])
