import logging
import os

from flask import Flask
from flask_bcrypt import Bcrypt
from flask_compress import Compress
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from sendgrid import SendGridAPIClient

dir_path = os.path.dirname(os.path.realpath(__file__))
BUILD_ROOT = os.path.join(os.getcwd(), '..', 'frontend', 'build')
STATIC_DIR = os.path.join(BUILD_ROOT, 'static')
app = Flask(__name__, static_folder=STATIC_DIR)
Compress(app)
bcrypt = Bcrypt(app)
gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers

profile = os.environ.get('FLASK_ENV')
if profile == "development":
    app.config.from_object("neurodex.config.DevelopmentConfig")
elif profile == "production":
    app.config.from_object("neurodex.config.ProductionConfig")
else:
    app.config.from_object("neurodex.config.Config")

db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)
sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
socketio = SocketIO(app)


@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))
    emit("my_event_from_server", "msg")
