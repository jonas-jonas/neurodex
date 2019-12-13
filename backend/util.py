from flask import request, jsonify
import jwt
from . import app, db
from backend.data.models import User
from functools import wraps

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
            current_user = db.session.query(
                User).filter_by(id=data['id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated
