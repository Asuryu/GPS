import sqlite3

def get_menu(period="all", type="all"):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    if period == "all" and type == "all":
        cursor.execute("SELECT * FROM MENU")
    elif period == "all" and type != "all":
        cursor.execute("SELECT * FROM MENU WHERE type = ?", (type,))
    elif period != "all" and type == "all":
        cursor.execute("SELECT * FROM MENU WHERE period = ?", (period,))
    else:
        cursor.execute("SELECT * FROM MENU WHERE period = ? AND type = ?", (period, type))
    meals = cursor.fetchall()
    db.close()
    return meals

def get_user_intents(email):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT * FROM INTENTIONS WHERE user_id = ?", (email,))
    intentions = cursor.fetchall()
    db.close()
    return intentions

def register_meal_intention(email, meal_id):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT * FROM INTENTIONS WHERE user_id = ? AND menu_id = ?", (email, meal_id))
    if cursor.fetchone() is not None:
        db.close()
        return False
    cursor.execute("INSERT INTO INTENTIONS (user_id, menu_id) VALUES (?, ?)", (email, meal_id))
    db.commit()
    db.close()
    return True

def delete_meal_intention(email, meal_id):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM INTENTIONS WHERE user_id = ? AND menu_id = ?", (email, meal_id))
    db.commit()
    db.close()
    return True

def get_user_by_email(email):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT * FROM USERS WHERE email = ?", (email,))
    user = cursor.fetchone()
    if user is None:
        db.close()
        return None
    db.close()
    return user

def update_user_role(email, role):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("UPDATE USERS SET role = ? WHERE email = ?", (role, email))
    db.commit()
    db.close()
    return True