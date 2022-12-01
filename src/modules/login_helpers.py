import sqlite3

def check_user(email):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute(f'SELECT * FROM users WHERE email="{email}"')
    user = cursor.fetchone()
    return user