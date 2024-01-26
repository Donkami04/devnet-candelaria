# Funcion empleada para darle estado UP o DOWN al AP
def status_ap_function(mydb, current_aps):
    cursor = mydb.cursor()
    cursor.execute("SELECT * FROM dcs.data_ap")
    
    column_names = [column[0] for column in cursor.description]
    dataAps = []
    for row in cursor:
        row_dict = {}
        for i in range(len(column_names)):
            row_dict[column_names[i]] = row[i]
        dataAps.append(row_dict)
        
    for data in dataAps:
        data.pop('id', None)
    

    for ap in dataAps:
        if ap in current_aps:
            ap['status'] = 'Up'
        else:
            ap['status'] = 'Down'
        
    cursor.close()
    return dataAps
    