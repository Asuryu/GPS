import flask
import flask_login
import sqlite3
import json
from functools import wraps
from modules.User import User
from modules.login_helpers import check_user, check_login_ipc
from modules.database_helpers import get_menu

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
            return flask.redirect(flask.url_for('protected'))
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
    return flask.redirect(flask.url_for('protected'))

@app.route('/menu', methods=['GET'])
@flask_login.login_required
def menu():
    # get param type
    type = flask.request.args.get('type')
    print(type)
    if type is None:
        type = "Peixe"
    
    menu = get_menu(type=type)

    return flask.render_template('menu.html', type=type, menu=menu)

@app.route('/queue')
@flask_login.login_required
def queue():
    if flask_login.current_user.urole == "admin":
        return flask.render_template('queue.html', role="admin")
    return flask.render_template('queue.html', role="user")

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
def queue_name_delete(queue_name):
    if(queue_name == "peixe"):
        queues["queues"][0]["counter"] -= 1
        return queues["queues"][0], 200
    elif(queue_name == "carne"):
        queues["queues"][1]["counter"] -= 1
        return queues["queues"][1], 200
    elif(queue_name == "vegetariano"):
        queues["queues"][2]["counter"] -= 1
        return queues["queues"][2], 200
    else:
        return "Queue not found", 404

@app.route('/queue/<queue_name>', methods=['PATCH'])
@flask_login.login_required
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

@app.route('/protected')
@flask_login.login_required
@admin_required
def protected():
    return "You are logged in as " + flask_login.current_user.id

@app.route('/logout')
@flask_login.login_required
def logout():
    flask_login.logout_user()
    return flask.redirect(flask.url_for('login'))



app.run(host="0.0.0.0", port=80)