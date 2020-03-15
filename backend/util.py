import os
import uuid
from datetime import datetime
from functools import wraps

import jwt
import yaml
from flask import jsonify, request
from flask.json import JSONEncoder

from backend import app, bcrypt, db
from backend.data.models import Role, User

token_key = 'x-access-token'


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if token_key in request.cookies:
            token = request.cookies[token_key]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = db.session.query(User).filter_by(id=data['id']).first()
            if current_user is None:
                return jsonify({'message': 'User not found'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token could not be validated!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


class CustomJSONEncoder(JSONEncoder):

    def default(self, obj):
        try:
            if isinstance(obj, datetime):
                return obj.isoformat()
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)
        return JSONEncoder.default(self, obj)


def init_db():
    if db.session.query(User).count() == 0:
        dir_path = os.path.dirname(os.path.realpath(__file__))

        with open(dir_path + "/config.yaml", 'r') as stream:
            try:
                config = yaml.safe_load(stream)

                roles = config['roles']
                init_roles(roles)

                users = config['users']
                init_users(users)

            except yaml.YAMLError as exc:
                print(exc)


def init_roles(roles):
    for role in roles:
        if db.session.query(Role).filter_by(id=role).first() is None:
            role_model = Role(id=role)
            db.session.add(role_model)
            db.session.commit()


def init_users(users):
    for user in users:
        pw = bcrypt.generate_password_hash(user['password']).decode('utf8')
        user_model = User(id=str(uuid.uuid4()), email=user['email'], password=pw)
        for role in user['roles']:
            role_model = db.session.query(Role).filter_by(id=role).first()
            user_model.roles.append(role_model)
        db.session.add(user_model)
        db.session.commit()
