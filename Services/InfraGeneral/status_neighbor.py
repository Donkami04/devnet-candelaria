
def status_neighbor(mydb, current_neighbors):
    cursor = mydb.cursor()
    cursor.execute("SELECT * FROM dcs.data_neighbors")
    
    column_names = [column[0] for column in cursor.description]
    dataNeighbor = []
    for row in cursor:
        row_dict = {}
        for i in range(len(column_names)):
            row_dict[column_names[i]] = row[i]
        dataNeighbor.append(row_dict)
        
    for data in dataNeighbor:
        data.pop('id', None)
    

    for neighbor in dataNeighbor:
        if neighbor in current_neighbors:
            neighbor['status'] = 'Up'
        else:
            neighbor['status'] = 'Down'
        
    return dataNeighbor
    
#! Cerrar Cursor