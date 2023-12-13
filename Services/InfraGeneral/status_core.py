import subprocess

def ping_host(ip):
    try:
        response = subprocess.run(['ping', '-c', '4', ip], capture_output=True, text=True, timeout=10)
        if response.returncode == 0:
            return "Up", response.stdout
        else:
            return "Down", response.stderr
    except subprocess.TimeoutExpired:
        return "Down", "Tiempo de espera agotado (ping no respondió en el tiempo especificado)."



