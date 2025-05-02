import traceback
import logging
from datetime import datetime


def update_mac(last_data, current_data):
    try:
        # Lista donde se almacenarán los datos actualizados
        data_updated = last_data.copy()

        # Actualizar las direcciones MAC en la lista last_data
        if current_data != False:
            for last in data_updated:
                for current in current_data:
                    if (
                        last["client"] == current["ip"]
                        and last["current_mac"] != current["mac"]
                    ):
                        last["current_mac"] = current["mac"]
                        break

            # Crear nuevos diccionarios para IPs en current_data que no están en last_data
            current_ips = [entry["ip"] for entry in current_data]
            last_ips = [entry["client"] for entry in last_data]

            # Agregar nuevos dispositivos a la lista si su IP no está en last_data
            for current in current_data:
                if current["ip"] not in last_ips:
                    new_entry = {
                        "id": None,
                        "ubication": None,
                        "device": None,
                        "client": current["ip"],
                        "last_mac": None,
                        "current_mac": current["mac"],
                        "note": None,
                        "last_change_date": None,
                        "status": None,
                        "prtg_status": None,
                        "prtg_id": None,
                        "status_num_clients": None,
                    }
                    data_updated.append(new_entry)

            return data_updated

        else:
            return False

    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `update_mac` en el archivo `db_update_devnet`"
        )
        logging.error(e)
        return False


def check_ip_in_output(last_data, current_data):
    try:
        data_updated = last_data
        ips = [data["ip"] for data in current_data]

        # Validar si hay coincidencias entre las listas
        for e in last_data:
            if e["client"] in ips:
                e["is_currently"] = "Found"
            else:
                e["is_currently"] = "Not Found"

        for last in last_data:
            if (
                last["is_currently"] == "Not Found"
                and last["current_mac"] != "Not Found"
            ):
                last["last_mac"] = last["current_mac"]
                last["current_mac"] = "Not Found"
                break

        return data_updated

    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `check_ip_in_output` en el archivo `db_update_devnet`"
        )
        logging.error(e)

# last_data = [
#     {
#         "id": 349,
#         "ubication": "RA 10",
#         "device": "Cliente 1",
#         "client": "10.117.125.10",
#         "last_mac": "Prueba 1",
#         "current_mac": "mac vieja",
#         "note": "No data",
#         "last_change_date": "2024-06-14 11:09:32",
#         "status": "Not Found",
#         "prtg_status": "Not Found",
#         "prtg_id": 0,
#         "status_num_clients": "N/A",
#     },
#     {
#         "id": 350,
#         "ubication": "RA 11",
#         "device": "Cliente 2",
#         "client": "10.117.125.11",
#         "last_mac": "Prueba 2",
#         "current_mac": "b874.1d39.1609",
#         "note": "No data",
#         "last_change_date": "2024-06-15 12:10:32",
#         "status": "Not Found",
#         "prtg_status": "Not Found",
#         "prtg_id": 1,
#         "status_num_clients": "N/A",
#     },
# ]

# current_data = [
#     {"ip": "10.117.125.10", "mac": "A"},
#     {"ip": "10.117.123.12", "mac": "B"},
#     {"ip": "10.117.125.11", "mac": "C"},
#     {"ip": "10.117.112.6", "mac": "D"},
# ]

# print(update_mac(last_data, current_data))
