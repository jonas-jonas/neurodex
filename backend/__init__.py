import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

STATIC_ROOT = os.path.join(os.pardir, 'build')
app = Flask(__name__, static_folder=STATIC_ROOT)

app = Flask(__name__)

app.config['SECRET_KEY'] = 'hierkommtnochmalwasgutesreinhaha'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:docker@localhost/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
