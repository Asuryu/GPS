import sqlite3
from bs4 import BeautifulSoup
import requests
from requests.adapters import HTTPAdapter

izek_adapter = HTTPAdapter(max_retries=10)
s = requests.Session()
s.mount("https://inforestudante.ipc.pt", izek_adapter)

def check_user(email):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute(f'SELECT * FROM users WHERE email="{email}"')
    user = cursor.fetchone()
    # check if user is admin
    print(user)
    return user


def check_login_ipc(email, password):

    user = check_user(email)

    if user is not None and user[1] == "admin": return True

    data = { "tipoCaptcha": "text", "username": email, "password": password }
    r = post("https://inforestudante.ipc.pt/nonio/security/login.do?method=submeter", data)
    soup = BeautifulSoup(r.text, 'html.parser') # parse the html so we can inspect it
    error1 = soup.find("div", {"id": "div_erros_preenchimento_formulario"})
    
    if error1 is None:
        return True

    return False

def post(url, data):
    while True:
        try:
            r = s.post(url, data=data, timeout=15)
        except:
            continue

        if r.status_code == 200:
            break
    return r