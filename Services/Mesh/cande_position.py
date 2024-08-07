import pymssql
import re
import logging

def get_cande_data(eqmt):
    server = "10.224.98.50"
    user = "lundinmining\\svc.cl.can.dashboard"
    password = "T3cn0l0g1a.20309"
    database = "Mina"

    conn = pymssql.connect(server=server, user=user, password=password, database=database)
    cursor = conn.cursor(as_dict=True)
    latitud = 99.999
    longitud = 99.999

    if "P" in eqmt:
        eqmt = eqmt.replace("P", "PALA")

    try:
        cursor.execute("SELECT TOP 1000 ([timestamp]), [Equipo], [GPS_Latitud], [GPS_Longitud], [GPS_Elevacion], [DSP_Status], [Status] FROM [Mina].[dbo].[ubicacion_equipos] order by [timestamp] desc")
        for row in cursor:
            if row["Equipo"] == eqmt:
                # Convertir los valores a cadenas antes de aplicar expresiones regulares
                latitud_str = str(row["GPS_Latitud"])
                longitud_str = str(row["GPS_Longitud"])
                
                # Utilizamos expresiones regulares para extraer los números con signo de las columnas GPS_Latitud y GPS_Longitud
                latitud = re.findall(r'(-?\d+\.\d+)', latitud_str)[0]
                longitud = re.findall(r'(-?\d+\.\d+)', longitud_str)[0]
                
                # print(row["timestamp"], row["Equipo"], latitud[0], longitud[0], row["GPS_Elevacion"], row["DSP_Status"], row["Status"])
                # print(longitud,latitud)
                break
        return float(latitud), float(longitud)

    except Exception as e:
        logging.error("Error en la funcion `get_cande_data`")
        logging.error(e)
        latitud = 99.999
        longitud = 99.999
        return latitud, longitud
    
    finally:
        conn.close()
        
# get_cande_data("P23")
