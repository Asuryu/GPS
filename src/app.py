import flask
import sqlite3
from functools import wraps
import bcrypt

app = flask.Flask(__name__)
app.secret_key = "R1BTMjAyMiAtIFRlYW0gMjQ"
app.static_folder = 'static'
app.config["DEBUG"] = True

db = sqlite3.connect("database.sqlite", check_same_thread=False)

@app.route("/", methods=["GET"])
def index():
    return flask.render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if flask.request.method == "GET":
        return flask.render_template("login.html")
    
    email = flask.request.form.get("email")
    if(email is None): 
        return "Email is required"
    return flask.redirect("/")

@app.route("/menu", methods=["GET"])
def menu():
    return flask.render_template("menu.html")

@app.route("/queue", methods=["GET"])
def queue():
    return flask.render_template("queue.html")

@app.route('/logout')
def logout():
    return flask.redirect("/")

app.run(host="0.0.0.0", port=80)