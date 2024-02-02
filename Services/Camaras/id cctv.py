import pandas as pd

# Cargar los datos desde los archivos CSV
datos_df = pd.read_csv('datos.csv', header=None)
devices_df = pd.read_csv('data_devices.csv', header=None)

# Renombrar las columnas para facilitar el acceso
datos_df.columns = ['Col1', 'Col2', 'IP', 'Valor']
devices_df.columns = ['ID', 'IP', 'Col3', 'Col4', 'Col5', 'Col6']

# Iterar sobre cada fila en datos_df
for index, row in datos_df.iterrows():
    ip_buscar = row['IP']
    valor_agregar = row['Valor']

    # Buscar la fila correspondiente en devices_df
    matching_row = devices_df[devices_df['IP'] == ip_buscar]

    # Verificar si se encontró una coincidencia
    if not matching_row.empty:
        # Obtener el índice de la fila encontrada
        matching_index = matching_row.index[0]

        # Agregar el valor a la nueva columna en devices_df
        devices_df.at[matching_index, 'Nuevo_Valor'] = valor_agregar

# Guardar el resultado en un nuevo archivo CSV
devices_df.to_csv('data_devices_actualizado.csv', index=False)
