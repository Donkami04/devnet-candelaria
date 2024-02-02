import requests
import os
from dotenv import load_dotenv
import csv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()


id_camera = 56
username_cctv = os.getenv('CCTV_USER')
password_cctv = os.getenv('CCT_PASS')
CCTV_DATA_SINGLE_CAMERA = os.getenv('CCTV_DATA_SINGLE_CAMERA').format(id_camera=id_camera)

auth = (username_cctv, password_cctv)
data_camera = requests.get(CCTV_DATA_SINGLE_CAMERA, auth=auth).json()
cctv_enabled = data_camera.get('data').get('status').get('enabled')

print(cctv_enabled)