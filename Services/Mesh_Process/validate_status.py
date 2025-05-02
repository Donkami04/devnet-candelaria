import logger_config
import logging
import traceback
from collections import Counter

def validate_status(devices):
    try:

        for d in devices:
            d["status"] = "ok"

        # Contamos las MACs que **no** pertenecen a clientes que contienen "pala"
        mac_count = Counter(
            d["current_mac"] for d in devices if "pala" not in (d["ubication"] or "").lower()
        )

        # Luego, marcamos como 'down' solo los dispositivos duplicados y que no son de tipo 'pala'
        for d in devices:
            if mac_count[d["current_mac"]] > 1 and "pala" not in (d["ubication"] or "").lower():
                d["status"] = "fail"
                
        for d in devices:
            if d["current_mac"] == 'Not Found':
                d["status"] = "Not Found"

        return devices

    except Exception as e:
        # En caso de error, se captura la excepción y se retorna un mensaje con el error
        logging.error(traceback.format_exc())
        return False


test = [
    {
        "id": 349,
        "ubication": "RA 10",
        "device": "Cliente 1",
        "client": "10.117.125.10",
        "last_mac": "Prueba 1",
        "current_mac": "a874.1d39.1609",
        "note": "No data",
        "last_change_date": "2024-06-14 11:09:32",
        "status": "Not Found",
        "prtg_status": "Not Found",
        "prtg_id": 0,
        "status_num_clients": "N/A",
    },
    {
        "id": 349,
        "ubication": "RAX 10",
        "device": "Cliente 1",
        "client": "10.117.125.10",
        "last_mac": "Prueba 1",
        "current_mac": "a874.1d39.1609",
        "note": "No data",
        "last_change_date": "2024-06-14 11:09:32",
        "status": "Not Found",
        "prtg_status": "Not Found",
        "prtg_id": 0,
        "status_num_clients": "N/A",
    },
    {
        "id": 492,
        "ubication": "Pala 11",
        "device": "Cliente 2",
        "client": "10.117.125.11",
        "last_mac": "Prueba 1",
        "current_mac": "a874.1d39.1609",
        "note": "No data",
        "last_change_date": "2024-06-14 11:09:32",
        "status": "Not Found",
        "prtg_status": "Not Found",
        "prtg_id": 0,
        "status_num_clients": "N/A",
    },
]

# print(validate_status(test))

# def validate_status(mesh_process_data, command_data):
#     try:

#         # Inicializamos el atributo status_detail_mac y status_num_clients
#         #  para cada elemento de la lista de clientes mesh
#         for item in mesh_process_data:
#             item["status"] = "ok"
#             item["status_num_clients"] = "ok"
#             if item["device"] != "Cisco AP":
#                 item["status_num_clients"] = "N/A"

#         # Asignamos el valor a el atributo status_num_clients
#         for ubication in command_data:
#             for item in mesh_process_data:
#                 if ubication == item["ubication"] and item["device"] == "Cisco AP":
#                     item["status_num_clients"] = command_data[ubication]["status_num_clients"]

#         # Primero obtenemos el listado de direcciones mac correspondientes a cada ubication
#         for ubication in command_data:
#             mac_list = command_data[ubication]["mac_addresses"]

#             # Obtenemos el valor individual de cada MAC del listado ligado a la Ubication
#             for mac in mac_list:

#                 # Recorremos los datos de mesh_process_data buscando si esta mac se encuentra
#                 # en otra ubication
#                 for item in mesh_process_data:
#                     if item["current_mac"] == mac and ubication != item["ubication"]:
#                         item["status"] = "fail"
#                         for element in mesh_process_data:
#                             if element["ubication"] == item["ubication"] and element["device"] == "Cisco AP":
#                                 element["status"] = "fail"


#         return mesh_process_data

#     except Exception as e:
#         logging.error(e)
#         logging.error("Error en validate_status en el archivo validate_status")
#         logging.error(traceback.format_exc())
#         return []
