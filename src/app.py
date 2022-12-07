import flask
import flask_login
import sqlite3
import json
from functools import wraps
from modules.User import User
from modules.login_helpers import *
from modules.database_helpers import *


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
            "counter": 1,
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


@login_manager.user_loader
def user_loader(email):
    user = check_user(email)
    if user is None:
        return

    user = User(user[0], user[1])
    return user

@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    user = check_user(email)
    if user is None:
        return

    user = User(user[0], user[1])
    return user

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not flask_login.current_user.urole == "admin":
            return unauthorized_handler()
        return f(*args, **kwargs)
    return decorated_function

@login_manager.unauthorized_handler
def unauthorized_handler():
    if flask_login.current_user.is_authenticated:
        return flask.render_template("status/401.html")
    else:
        return flask.redirect(flask.url_for('login'))

@app.errorhandler(404)
def page_not_found(e):
    return flask.redirect(flask.url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():

    if flask.request.method == 'GET':
        if(flask_login.current_user.is_authenticated):
            return flask.redirect(flask.url_for('index'))
        else:
            return flask.render_template('login.html')

    email = flask.request.form['email']
    password = flask.request.form['password']

    if check_login_ipc(email, password) == False:
        return flask.render_template('login.html', error="Credenciais inválidas")

    user = check_user(email)
    if(user is None):
        db = sqlite3.connect('database.db')
        db.execute(f'INSERT INTO users VALUES ("{email}", "user")')
        db.commit()
        user = User(email, "user")
    else:
        user = User(user[0], user[1])
    
    flask_login.login_user(user)
    return flask.redirect(flask.url_for('index'))



@app.route('/menu', methods=['GET'])
@flask_login.login_required
def menu():
    # get param type
    type = flask.request.args.get('type')
    print(type)
    if type is None:
        menu = get_menu(type="Peixe")
        return flask.render_template('menu.html', type="Peixe", menu=menu, role=flask_login.current_user.urole)
    
    menu = get_menu(type=type)
    return {"menu": menu, "type": type}

@app.route('/queue')
@flask_login.login_required
def queue():
    return flask.render_template('queue.html', role=flask_login.current_user.urole)

@app.route('/admin_manager')
@flask_login.login_required
@admin_required
def admin_manager():
    return flask.render_template('adminManager.html', role="admin")

@app.route('/menu_update')
@flask_login.login_required
@admin_required
def menu_update():
    return flask.render_template('menuUpdate.html', role="admin")

@app.route('/statistics')
@flask_login.login_required
@admin_required
def statistics():
    return flask.render_template('statistics.html', role="admin")

@app.route('/')
@flask_login.login_required
def index():
    return flask.render_template('index.html', role=flask_login.current_user.urole)

@app.route('/intent', methods=['GET'])
@flask_login.login_required
def get_intents():
    ret = get_user_intents(flask_login.current_user.id)
    intents = []
    for intent in ret:
        intents.append(intent[2])
    return {"intents": intents}

@app.route('/intent', methods=['POST'])
@flask_login.login_required
def intent():
    meal_id = flask.request.form['meal_id']
    print(meal_id)
    ret = register_meal_intention(flask_login.current_user.id, meal_id)
    if ret == True:
        return "Meal intent saved!", 200
    else:
        return "Meal intent already registered", 400

@app.route('/intent', methods=['DELETE'])
@flask_login.login_required
def delete_intent():
    meal_id = flask.request.form['meal_id']
    print(meal_id)
    ret = delete_meal_intention(flask_login.current_user.id, meal_id)
    if ret == True:
        return "Meal intent deleted!", 200
    else:
        return "Meal intent not found", 400

#TODO: when the admin changes the menu, all meal intentions with 
# the meal id of the meal that was removed should be deleted

@app.route('/queue/<queue_name>', methods=['GET'])
@flask_login.login_required
def queue_name(queue_name):
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

@app.route('/queue/<queue_name>', methods=['POST'])
@flask_login.login_required
@admin_required
def queue_name_post(queue_name):
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

@app.route('/queue/<queue_name>', methods=['DELETE'])
@flask_login.login_required
@admin_required
def queue_name_delete(queue_name):
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

@app.route('/queue/<queue_name>', methods=['PATCH'])
@flask_login.login_required
@admin_required
def queue_name_patch(queue_name):
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

@app.route('/users/get_user_by_id/<user_id>', methods=['GET'])
@flask_login.login_required
@admin_required
def get_user(user_id):
    user = get_user_by_email(user_id)
    if user is None:
        return "User not found", 404
    else:
        return {"email": user[0], "role": user[1].capitalize()}

@app.route('/users/update_user', methods=['POST'])
@flask_login.login_required
@admin_required
def post_user():
    user_id = flask.request.form['user_id']
    new_role = flask.request.form['new_role']
    
    # check if user exists
    user = get_user_by_email(user_id)
    if user is None:
        return "User not found", 404
    
    # update user role
    if update_user_role(user_id, new_role):
        if flask_login.current_user.id == user_id:
            flask_login.logout_user()
            return "User role updated. Please login again", 201
        return "User role updated", 200


@app.route('/meal', methods=['GET'])
@flask_login.login_required
def meal():
    return flask.render_template('meal.html', role=flask_login.current_user.urole)

@app.route('/logout')
@flask_login.login_required
def logout():
    flask_login.logout_user()
    return flask.redirect(flask.url_for('login'))



app.run(host="0.0.0.0", port=80)