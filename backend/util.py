import os
import uuid
from datetime import datetime

import yaml
from flask.json import JSONEncoder

from backend import bcrypt, db
from backend.data.models import Role, User


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
