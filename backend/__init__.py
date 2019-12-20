import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

BUILD_ROOT = os.path.join(os.getcwd(), 'build')
STATIC_DIR = os.path.join(BUILD_ROOT, 'static')
app = Flask(__name__, static_folder=STATIC_DIR)
bcrypt = Bcrypt(app)

app.config['SECRET_KEY'] = 'hierkommtnochmalwasgutesreinhaha'

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
