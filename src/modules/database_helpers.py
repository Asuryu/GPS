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
    print(meals)
    return meals