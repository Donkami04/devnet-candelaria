cisco_client_response = {
    'errorDocument': {'httpResponseCode': 404, 'httpMethod': 
        'GET', 'message': 'No such entity as ClientsV4 / 1,460,170,872.-PRS-101', 
        'id': 'presentation.PRS-101', 
        'uriPath': 'data/Clients/1460170872', 
        'queryParams': '{}', 
        'domain': 'ROOT-DOMAIN'
    }
}

cisco_client_data = cisco_client_response.get('queryResponse', {'queryResponse':'Not Found'}).get('entity', [{}])[0].get('clientsDTO', 'Not Found')
print(cisco_client_data)