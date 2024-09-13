import docker
import time

def bytes_to_gb(bytes_value):
    """Convertir bytes a gigabytes y formatear como cadena con 'GB'."""
    gb_value = bytes_value / (1024 ** 3)  # Convertir bytes a gigabytes
    return f"{gb_value:.2f} GB"  # Formatear con dos decimales y agregar 'GB'

def calculate_cpu_percent(stats):
    """Calcular el porcentaje de uso de la CPU a partir de las estadísticas."""
    cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
    system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
    
    if system_delta > 0 and cpu_delta > 0:
        num_cpus = len(stats['cpu_stats']['cpu_usage']['percpu_usage'])
        cpu_percent = (cpu_delta / system_delta) * num_cpus * 100.0
    else:
        cpu_percent = 0.0
    return cpu_percent

def main():

    # Crear una instancia del cliente Docker
    client = docker.from_env()

    # Listar todos los contenedores (activos y detenidos)
    containers = client.containers.list(all=True)

    # Lista para almacenar la información de los contenedores
    containers_info = []

    # Obtener estadísticas para cada contenedor
    for container in containers:
        # Obtener estadísticas
        stats = container.stats(stream=False)
        
        # Calcular el porcentaje de uso de la CPU
        cpu_usage_percent = calculate_cpu_percent(stats)
        
        # Crear un diccionario para el contenedor con valores formateados
        container_dict = {
            'name': container.name,
            'status': container.status,  # Obtener el estado del contenedor
            'cpu_usage_percent': f"{cpu_usage_percent:.2f}%",  # Porcentaje de uso de CPU
            'memory_usage': bytes_to_gb(stats['memory_stats']['usage']),
            'memory_limit': bytes_to_gb(stats['memory_stats']['limit'])
        }
        
        # Añadir el diccionario a la lista
        containers_info.append(container_dict)

    
    