import flask
import flask_login
import sqlite3
from functools import wraps
from modules.User import User
from modules.login_helpers import *
from modules.database_helpers import *
from modules.password_helpers import *
from modules.statistics_helpers import *


app = flask.Flask(__name__)
app.secret_key = 'R1BTMjAyMiAtIFRlYW0gMjQ='
app.debug = True
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

db = sqlite3.connect('database.db')

queues = {
    "queues": [
        {
            "name": "Peixe",
            "counter": 0,
            "enabled": True
        },
        {
            "name": "Carne",
            "counter": 0,
            "enabled": True
        },
        {
            "name": "Vegetariano",
            "counter": 0,
            "enabled": True
        }
    ]
}


# User loader for flask-login
# Returns a User object with the given email
@login_manager.user_loader
def user_loader(email):
    user = check_user(email)
    if user is None:
        return

    user = User(user[0], user[1])
    return user

# Request loader for flask-login
# Returns a User object with the given email
@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    user = check_user(email)
    if user is None:
        return

    user = User(user[0], user[1])
    return user

# Decorator to check if the user is an admin
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not flask_login.current_user.urole == "admin":
            return unauthorized_handler() # If the user is not an admin, return the unauthorized handler
        return f(*args, **kwargs)
    return decorated_function

# Function to handle unauthorized requests
@login_manager.unauthorized_handler
def unauthorized_handler():
    if flask_login.current_user.is_authenticated:
        return flask.render_template("status/401.html")
    else:
        return flask.redirect(flask.url_for('login'))
    
# Function to handle 404 errors
@app.errorhandler(404)
def page_not_found(e):
    return flask.redirect(flask.url_for('login')) # Redirect to login page

# API route to handle login
@app.route('/login', methods=['GET', 'POST'])
def login():

    if flask.request.method == 'GET': # If the request is a GET request, render the login page
        if(flask_login.current_user.is_authenticated):
            return flask.redirect(flask.url_for('index'))
        else:
            return flask.render_template('login.html')

    email = flask.request.form['email'] 
    password = flask.request.form['password']

    if check_login_ipc(email, password) == False: # Check if the user is allowed to login
        return flask.render_template('login.html', error="Invalid credentials")

    user = check_user(email, password) # Check if the user exists in the database
    if user == -1: # If the password in the database is not the same as the one provided, return an error
        return flask.render_template('login.html', error="Invalid credentials")
    if(user is None): # If the user does not exist, create a new user
        db = sqlite3.connect('database.db')
        hashed_password = hash_password(password) # Hash the password
        db.execute(f'INSERT INTO users VALUES ("{email}", "user", "{hashed_password}")')
        db.commit()
        user = User(email, "user")
    else: # If the user exists, create a new User object
        user = User(user[0], user[1])
    
    flask_login.login_user(user) # Login the user
    return flask.redirect(flask.url_for('index')) # Redirect to the index page

# API route to handle the menu page
@app.route('/menu', methods=['GET'])
@flask_login.login_required
def menu():
    type = flask.request.args.get('type') # Get the type of the menu
    if type is None: # If the type is not specified, return the menu page with the first menu
        menu = get_menu(type="Peixe") # Get the menu
        return flask.render_template('menu.html', type="Peixe", menu=menu, role=flask_login.current_user.urole) # Render the menu page
    
    # If the type is specified, return the menu page with the specified menu
    menu = get_menu(type=type) # Get the menu
    return {"menu": menu, "type": type}

# API route to handle menu editing
@app.route('/menu', methods=['POST'])
@flask_login.login_required
@admin_required
def menu_post():
    menu_id = flask.request.form['menu_id'] # Get the menu ID
    new_title = flask.request.form['new_title'] # Get the new title
    new_description = flask.request.form['new_description'] # Get the new description

    ret = update_menu_item(menu_id, new_title, new_description) # Update the menu item

    if ret == True: # If the menu item was updated, return a success message
        return {"message": "Meal successfully edited", menu_id: menu_id, new_title: new_title, new_description: new_description}, 200
    else: # If the menu item was not updated, return an error message
        return {"message": f"Meal with ID {menu_id} does not exist", menu_id: menu_id}, 400

# API route to handle queue page
@app.route('/queue')
@flask_login.login_required
def queue():
    return flask.render_template('queue.html', role=flask_login.current_user.urole) # Render the queue page

# API route to handle the admin manager page
@app.route('/admin_manager')
@flask_login.login_required
@admin_required
def admin_manager():
    return flask.render_template('adminManager.html', role="admin") # Render the admin manager page

# API route to handle the statistics page
@app.route('/statistics', methods=['GET'])
@flask_login.login_required
@admin_required
def statistics():
    return flask.render_template('statistics.html', role="admin") # Render the statistics page

# API route to handle GET requests to fetch the statistics
@app.route('/statistics/all', methods=['GET'])
@flask_login.login_required
@admin_required
def get_statistics():
    meal_types = generate_statistics_for_meal_types() # Generate the statistics for the meal types
    meal_periods = generate_statistics_for_meal_periods() # Generate the statistics for the meal periods
    return { "meal_types": meal_types, "meal_periods": meal_periods } # Return the statistics

# API route to handle the index page
@app.route('/')
@flask_login.login_required
def index():
    return flask.render_template('index.html', role=flask_login.current_user.urole) # Render the index page

# API route to handle requests to fetch user intents
@app.route('/intent', methods=['GET'])
@flask_login.login_required
def get_intents():
    ret = get_user_intents(flask_login.current_user.id) # Get the user intents
    intents = []
    for intent in ret:
        intents.append(intent[2]) # Append the meal IDs to the intents list
    return {"intents": intents}

# API route to handle changes to user intents
@app.route('/intent', methods=['POST'])
@flask_login.login_required
def intent():
    meal_id = flask.request.form['meal_id'] # Get the meal ID
    ret = register_meal_intention(flask_login.current_user.id, meal_id) # Register the meal intention
    if ret == True: # If the meal intention was registered, return a success message
        return "Meal intent saved!", 200
    else: # If the meal intention was not registered, return an error message
        return "Meal intent already registered", 400

# API route to handle deletion of user intents
@app.route('/intent', methods=['DELETE'])
@flask_login.login_required
def delete_intent():
    meal_id = flask.request.form['meal_id'] # Get the meal ID
    ret = delete_meal_intention(flask_login.current_user.id, meal_id) # Delete the meal intention
    if ret == True: # If the meal intention was deleted, return a success message
        return "Meal intent deleted!", 200
    else: # If the meal intention was not deleted, return an error message
        return "Meal intent not found", 400

# API route to handle requests to get queues information
@app.route('/queue/<queue_name>', methods=['GET'])
@flask_login.login_required
def queue_name(queue_name):
    # Depending on the queue name, return the queue information
    if(queue_name == "peixe"):
        return queues["queues"][0], 200
    elif(queue_name == "carne"):
        return queues["queues"][1], 200
    elif(queue_name == "vegetariano"):
        return queues["queues"][2], 200
    elif(queue_name == "all"):
        return queues, 200

    else:
        return "Queue not found", 404

# API route to handle incrementing the queue counter
@app.route('/queue/<queue_name>', methods=['POST'])
@flask_login.login_required
@admin_required
def queue_name_post(queue_name):
    # Depending on the queue name, increment the queue counter
    if(queue_name == "peixe"):
        queues["queues"][0]["counter"] += 1
        return queues["queues"][0], 200
    elif(queue_name == "carne"):
        queues["queues"][1]["counter"] += 1
        return queues["queues"][1], 200
    elif(queue_name == "vegetariano"):
        queues["queues"][2]["counter"] += 1
        return queues["queues"][2], 200
    else:
        return "Queue not found", 404

# API route to handle decrementing the queue counter
@app.route('/queue/<queue_name>', methods=['DELETE'])
@flask_login.login_required
@admin_required
def queue_name_delete(queue_name):
    # Depending on the queue name, decrement the queue counter
    if(queue_name == "peixe"):
        if (queues["queues"][0]["counter"] - 1 < 0):
            queues["queues"][0]["counter"] = 0
        else:  queues["queues"][0]["counter"] -= 1
        return queues["queues"][0], 200

    elif(queue_name == "carne"):
        if (queues["queues"][1]["counter"] - 1 < 0):
            queues["queues"][1]["counter"] = 0
        else:  queues["queues"][1]["counter"] -= 1
        return queues["queues"][1], 200

    elif(queue_name == "vegetariano"):
        if (queues["queues"][2]["counter"] - 1 < 0):
            queues["queues"][2]["counter"] = 0
        else:  queues["queues"][2]["counter"] -= 1
        return queues["queues"][2], 200
    else:
        return "Queue not found", 404

# API route to handle enabling/disabling the queue
@app.route('/queue/<queue_name>', methods=['PATCH'])
@flask_login.login_required
@admin_required
def queue_name_patch(queue_name):
    # Depending on the queue name, enable/disable the queue
    if(queue_name == "peixe"):
        queues["queues"][0]["enabled"] = not queues["queues"][0]["enabled"]
        return queues["queues"][0], 200
    elif(queue_name == "carne"):
        queues["queues"][1]["enabled"] = not queues["queues"][1]["enabled"]
        return queues["queues"][1], 200
    elif(queue_name == "vegetariano"):
        queues["queues"][2]["enabled"] = not queues["queues"][2]["enabled"]
        return queues["queues"][2], 200
    else:
        return "Queue not found", 404

# API route to handle requests to get the user's role
@app.route('/users/get_user_by_id/<user_id>', methods=['GET'])
@flask_login.login_required
@admin_required
def get_user(user_id):
    user = get_user_by_email(user_id) # Get the user's role
    if user is None: # If the user does not exist, return an error message
        return "User not found", 404
    else: # If the user exists, return the user's role
        return {"email": user[0], "role": user[1].capitalize()}

# API route to handle requests to update the user's role
@app.route('/users/update_user', methods=['POST'])
@flask_login.login_required
@admin_required
def post_user():
    user_id = flask.request.form['user_id'] # Get the user's email
    new_role = flask.request.form['new_role'] # Get the user's new role
    
    # Check if user exists
    user = get_user_by_email(user_id)
    if user is None: # If the user does not exist, return an error message
        return "User not found", 404
    
    # Update the user's role
    if update_user_role(user_id, new_role):
        if flask_login.current_user.id == user_id: # If the user's role was updated, log them out
            flask_login.logout_user()
            return "User role updated. Please login again", 201
        return "User role updated", 200

# API route to handle logout
@app.route('/logout')
@flask_login.login_required
def logout():
    flask_login.logout_user() # Log the user out
    return flask.redirect(flask.url_for('login')) # Redirect the user to the login page



app.run(host="0.0.0.0", port=80) # Run the app on port 80