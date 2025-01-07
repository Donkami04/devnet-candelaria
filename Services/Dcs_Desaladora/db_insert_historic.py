import traceback
import logging
from db_connections import historic_connection
from datetime import datetime, timedelta


def save_historic_data(data):
    """
    Guarda los datos históricos en la base de datos y elimina registros antiguos que tienen más de 12 meses.

    Esta función realiza dos operaciones principales en la base de datos:
    1. Elimina los registros de la tabla `candelaria_clients` que son anteriores a 12 meses desde la fecha actual.
    2. Inserta nuevos datos en la misma tabla, utilizando la información proporcionada en el argumento `data`.

    Cada entrada en `data` es un diccionario que debe contener las siguientes claves:
    'name', 'group', 'description', 'ip', 'status_prtg', 'lastup_prtg', 'lastdown_prtg', 'device_ip_cisco',
    'device_cisco', 'port_cisco', 'status_cisco', 'reachability_cisco', 'id_prtg', 'importancia', 'clave',
    'status_device_cisco', 'data_backup', y 'datetime'.

    En caso de que ocurra una excepción durante la ejecución:
    - Los detalles de la excepción se registran en los logs para su posterior análisis.
    - Se registra un mensaje de error específico indicando que hubo un problema en la función `save_historic_data`
      dentro del archivo `db_insert_historic`.

    Args:
        data (list[dict]): Lista de diccionarios, donde cada diccionario representa los datos de un cliente
                           que se van a insertar en la base de datos.

    Raises:
        Exception: Si ocurre algún error durante la conexión a la base de datos, la ejecución de la consulta,
                   o el cierre de la conexión.
    """
    # Calcular la fecha límite (12 meses atrás desde hoy)
    twelve_months_ago = datetime.now() - timedelta(days=365)
    twelve_months_ago_str = twelve_months_ago.strftime("%Y-%m-%d %H:%M:%S")

    # Consulta SQL para eliminar datos antiguos
    delete_query = """
    DELETE FROM `historic-devnet`.`candelaria_clients`
    WHERE `datetime` < %s
    """

    # Consulta SQL para insertar datos
    insert_query = """
    INSERT INTO `historic-devnet`.`candelaria_clients` (
        `name`,
        `group`,
        `description`,
        `ip`,
        `status_prtg`,
        `lastup_prtg`,
        `lastdown_prtg`,
        `device_ip_cisco`,
        `device_cisco`,
        `port_cisco`,
        `status_cisco`,
        `reachability_cisco`,
        `id_prtg`,
        `importancia`,
        `clave`,
        `status_device_cisco`,
        `data_backup`,
        `datetime`
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    data_tuple = [
        (
            client.get("name", ""),
            client.get("group", ""),
            client.get("description", ""),
            client.get("ip", ""),
            client.get("status_prtg", ""),
            client.get("lastup_prtg", ""),
            client.get("lastdown_prtg", ""),
            client.get("device_ip_cisco", ""),
            client.get("device_cisco", ""),
            client.get("port_cisco", ""),
            client.get("status_cisco", ""),
            client.get("reachability_cisco", ""),
            client.get("id_prtg", ""),
            client.get("importancia", ""),
            client.get("clave", ""),
            client.get("status_device_cisco", ""),
            client.get("data_backup", ""),
            client.get("datetime", ""),
        )
        for client in data
    ]

    try:
        db_connector = historic_connection()
        historic_cursor = db_connector.cursor()

        # Eliminar registros antiguos
        historic_cursor.execute(delete_query, (twelve_months_ago_str,))

        # Insertar nuevos datos
        historic_cursor.executemany(insert_query, data_tuple)
        db_connector.commit()

        db_connector.close()

        return True

    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `save_historic_data` en el archivo `db_insert_historic`"
        )
        logging.error(e)

        return False
