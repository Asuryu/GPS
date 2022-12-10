import sqlite3
from bs4 import BeautifulSoup
import requests
from requests.adapters import HTTPAdapter
from modules.password_helpers import * 

izek_adapter = HTTPAdapter(max_retries=10) # Adapter to retry requests in case of failure
s = requests.Session() # Session to keep cookies between requests
s.mount("https://inforestudante.ipc.pt", izek_adapter) # Mount the adapter to the session

# Returns a tuple with the user's email, role and hashed_password
def check_user(email, hashed_password=None):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute(f'SELECT * FROM users WHERE email="{email}"')
    user = cursor.fetchone()
    if user is None: # If the user doesn't exist
        db.close()
        return None
    if hashed_password is not None: # If the user exists and a password was given
        if not check_password(hashed_password, user[2]): # If the password is incorrect
            db.close()
            return -1
    return user

# Checks if the user with the given email and password exists in IPC's database
def check_login_ipc(email, password):

    user = check_user(email) # Check if the user exists in our database

    if user is not None and user[1] == "admin": return True # If the user exists in our database and is an admin, return True

    data = { "tipoCaptcha": "text", "username": email, "password": password } # Data to post to IPC's login page
    r = post("https://inforestudante.ipc.pt/nonio/security/login.do?method=submeter", data) # Post the data to IPC's login page
    soup = BeautifulSoup(r.text, 'html.parser') # parse the html so we can inspect it with BeautifulSoup
    error1 = soup.find("div", {"id": "div_erros_preenchimento_formulario"}) # Find the div with the error message
    
    if error1 is None: # If the user exists in IPC's database
        return True

    return False # If the user doesn't exist in IPC's database

# Helper function to post data to a url
def post(url, data):
    while True:
        try:
            r = s.post(url, data=data, timeout=15)
        except:
            continue

        if r.status_code == 200:
            break
    return r