

def validate_status(mesh_process_data, command_data):

    # Inicializamos el atributo status_detail_mac y status_num_clients
    #  para cada elemento de la lista de clientes mesh
    for item in mesh_process_data:
        item["status"] = "ok"
        item["status_num_clients"] = "ok"
        if item["device"] != "Cisco AP":
            item["status_num_clients"] = "N/A"

    # Asignamos el valor a el atributo status_num_clients
    for ubication in command_data:
        for item in mesh_process_data:
            if ubication == item["ubication"] and item["device"] == "Cisco AP":
                item["status_num_clients"] = command_data[ubication][
                    "status_num_clients"
                ]

    # Primero obtenemos el listado de direcciones mac correspondientes a cada ubication
    for ubication in command_data:
        mac_list = command_data[ubication]["mac_addresses"]

        # Obtenemos el valor individual de cada MAC del listado ligado a la Ubication
        for mac in mac_list:

            # Recorremos los datos de mesh_process_data buscando si esta mac se encuentra
            # en otra ubication
            for item in mesh_process_data:
                if item["current_mac"] == mac and ubication != item["ubication"]:
                    item["status"] = "fail"
                    for element in mesh_process_data:
                        if element["ubication"] == item["ubication"] and element["device"] == "Cisco AP":
                            element["status"] = "fail"


    return mesh_process_data