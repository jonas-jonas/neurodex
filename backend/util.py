from functools import wraps

import jwt
from flask import jsonify, request
from flask.json import JSONEncoder
from datetime import datetime

from backend import app, db
from backend.data.models import User

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
        except:
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
