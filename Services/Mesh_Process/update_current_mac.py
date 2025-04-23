import traceback
import logging
from datetime import datetime


def update_mac(last_data, current_data):
    try:
        data_updated = last_data
        for last in data_updated:
            for current in current_data:
                if (
                    last["client"] == current["ip"]
                    and last["current_mac"] != current["mac"]
                ):
                    last["last_mac"] = last["current_mac"]
                    last["current_mac"] = current["mac"]
                    last["last_change_date"] = datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )

                    break
        return data_updated

    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `update_mac` en el archivo `db_update_devnet`"
        )
        logging.error(e)
        return []


def check_ip_in_output(last_data, current_data):
    try:
        print("last_data ###### ======>", last_data)
        print("current_data ###### ======>", current_data)
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
