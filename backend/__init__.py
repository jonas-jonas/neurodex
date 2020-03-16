import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_compress import Compress
from flask_marshmallow import Marshmallow
from flask_jwt_extended import (JWTManager)

BUILD_ROOT = os.path.join(os.getcwd(), 'build')
STATIC_DIR = os.path.join(BUILD_ROOT, 'static')
app = Flask(__name__, static_folder=STATIC_DIR)
Compress(app)
bcrypt = Bcrypt(app)

app.config['JWT_SECRET_KEY'] = 'hierkommtnochmalwasgutesreinhaha'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/auth/refresh-token'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 10
app.config['JWT_COOKIE_CSRF_PROTECT'] = False

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)
