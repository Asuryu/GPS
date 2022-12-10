import sqlite3

def generate_statistics_for_meal_types():
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT menu_id FROM INTENTIONS")

    selected_meals = {
        "Peixe": 0,
        "Carne": 0,
        "Vegetariano": 0,
    }

    for row in cursor.fetchall():
        cursor.execute("SELECT type FROM MENU WHERE id = ?", (row[0],))
        meal_type = cursor.fetchone()[0]
        selected_meals[meal_type] += 1
    
    db.close()
    return selected_meals
    
def generate_statistics_for_meal_periods():
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT menu_id FROM INTENTIONS")

    selected_meals = {
        "Almoço": 0,
        "Jantar": 0
    }

    for row in cursor.fetchall():
        cursor.execute("SELECT period FROM MENU WHERE id = ?", (row[0],))
        meal_period = cursor.fetchone()[0]
        selected_meals[meal_period] += 1

    db.close()
    return selected_meals