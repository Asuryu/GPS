import sqlite3

# Returns the meals that match the given period and type
def get_menu(period="all", type="all"):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    if period == "all" and type == "all": # If both period and type are "all", get all the meals
        cursor.execute("SELECT * FROM MENU")
    elif period == "all" and type != "all": # If only type is not "all", get all the meals of the given type
        cursor.execute("SELECT * FROM MENU WHERE type = ?", (type,))
    elif period != "all" and type == "all": # If only period is not "all", get all the meals of the given period
        cursor.execute("SELECT * FROM MENU WHERE period = ?", (period,))
    else: # If both period and type are not "all", get all the meals of the given period and type
        cursor.execute("SELECT * FROM MENU WHERE period = ? AND type = ?", (period, type))
    meals = cursor.fetchall()
    db.close()
    return meals

# Returns all the meals that were selected by the user with the given email
def get_user_intents(email):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT * FROM INTENTIONS WHERE user_id = ?", (email,))
    intentions = cursor.fetchall()
    db.close()
    return intentions

# Registers a meal intention for the user with the given email
# The meal_id is the id of the meal in the menu table
def register_meal_intention(email, meal_id):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT * FROM INTENTIONS WHERE user_id = ? AND menu_id = ?", (email, meal_id)) # Check if the user already has an intention for the given meal
    
    # If the user already has an intention for the given meal
    if cursor.fetchone() is not None:
        db.close()
        return False

    # If the user doesn't have an intention for the given meal, insert it into the intentions table
    cursor.execute("INSERT INTO INTENTIONS (user_id, menu_id) VALUES (?, ?)", (email, meal_id)) 
    cursor.execute("SELECT * FROM MENU WHERE id = ?", (meal_id,))
    inserted_meal = cursor.fetchone()

    # Remove other intentions for the same weekday and different type
    cursor.execute("SELECT * FROM INTENTIONS WHERE user_id = ?", (email,))
    intention = cursor.fetchall()
    changed_intents = []
    for i in intention:
        cursor.execute("SELECT * FROM MENU WHERE id = ?", (i[2],))
        meal = cursor.fetchone()
        if(meal[4] != inserted_meal[4] and meal[5] == inserted_meal[5]):
            cursor.execute("DELETE FROM INTENTIONS WHERE user_id = ? AND menu_id = ?", (email, i[2]))
            changed_intents.append(meal)

    db.commit()
    db.close()
    return changed_intents

# Deletes a meal intention for the user with the given email
# The meal_id is the id of the meal in the menu table
def delete_meal_intention(email, meal_id):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM INTENTIONS WHERE user_id = ? AND menu_id = ?", (email, meal_id))
    db.commit()
    db.close()
    return True

# Returns the user with the given email
def get_user_by_email(email):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("SELECT * FROM USERS WHERE email = ?", (email,))
    user = cursor.fetchone()
    if user is None: # If the user doesn't exist
        db.close()
        return None
    db.close()
    return user

# Updates the role of the user with the given email
# The role can be "admin" or "user"
def update_user_role(email, role):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    cursor.execute("UPDATE USERS SET role = ? WHERE email = ?", (role, email))
    db.commit()
    db.close()
    return True

# Updates a meal in the menu
# The id is the id of the meal in the menu table
# The title is the new title of the meal
# The description is the new description of the meal
def update_menu_item(id, title, description):
    db = sqlite3.connect('database.db')
    cursor = db.cursor()
    ret = cursor.execute("UPDATE MENU SET title = ?, description = ? WHERE id = ?", (title, description, id))
    if ret.rowcount == 0: return False
    cursor.execute("DELETE FROM INTENTIONS WHERE menu_id = ?", (id,)) # Delete all the intentions for the meal
    db.commit()
    db.close()
    return True