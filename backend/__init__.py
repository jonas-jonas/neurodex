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

app.config.from_pyfile('application.cfg', silent=False)
profile = os.environ.get('FLASK_ENV')
if profile is not None:
    app.config.from_pyfile(f'application-{profile}.cfg', silent=True)

db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)
