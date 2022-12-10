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

# Returns a dictionary with the number of times each meal weekday was selected
def generate_statistics_for_meal_weekdays():
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT menu_id FROM INTENTIONS") # Get all the menu ids from the intentions table

    selected_meals = {
        "Segunda-Feira": 0,
        "Terça-Feira": 0,
        "Quarta-Feira": 0,
        "Quinta-Feira": 0,
        "Sexta-Feira": 0
    }

    for row in cursor.fetchall(): # For each menu id
        cursor.execute("SELECT weekday FROM MENU WHERE id = ?", (row[0],)) # Get the meal weekday from the menu table
        meal_weekday = cursor.fetchone()[0] # Get the first element of the tuple returned by fetchone()
        # meal weekday comes in 1-5 format, so we need to convert it to the weekday name
        if meal_weekday == 1: meal_weekday = "Segunda-Feira"
        elif meal_weekday == 2: meal_weekday = "Terça-Feira"
        elif meal_weekday == 3: meal_weekday = "Quarta-Feira"
        elif meal_weekday == 4: meal_weekday = "Quinta-Feira"
        elif meal_weekday == 5: meal_weekday = "Sexta-Feira"
        selected_meals[meal_weekday] += 1 # Increment the number of times the meal weekday was selected

    db.close()
    return selected_meals