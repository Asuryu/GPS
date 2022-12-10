import sqlite3

# Returns a dictionary with the number of times each meal type was selected
def generate_statistics_for_meal_types():
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT menu_id FROM INTENTIONS") # Get all the menu ids from the intentions table

    selected_meals = {
        "Peixe": 0,
        "Carne": 0,
        "Vegetariano": 0,
    }

    for row in cursor.fetchall(): # For each menu id
        cursor.execute("SELECT type FROM MENU WHERE id = ?", (row[0],)) # Get the meal type from the menu table
        meal_type = cursor.fetchone()[0] # Get the first element of the tuple returned by fetchone()
        selected_meals[meal_type] += 1 # Increment the number of times the meal type was selected
    
    db.close()
    return selected_meals

# Returns a dictionary with the number of times each meal period was selected
def generate_statistics_for_meal_periods():
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT menu_id FROM INTENTIONS") # Get all the menu ids from the intentions table

    selected_meals = {
        "Almoço": 0,
        "Jantar": 0
    }

    for row in cursor.fetchall(): # For each menu id
        cursor.execute("SELECT period FROM MENU WHERE id = ?", (row[0],)) # Get the meal period from the menu table
        meal_period = cursor.fetchone()[0] # Get the first element of the tuple returned by fetchone()
        selected_meals[meal_period] += 1 # Increment the number of times the meal period was selected

    db.close()
    return selected_meals