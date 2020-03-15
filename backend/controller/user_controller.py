import datetime
import uuid

import jwt
from flask import Blueprint, jsonify, make_response, request

from backend import app, db, bcrypt
from backend.data.models import User
from backend.util import token_required
from backend.data.schema import users_schema, user_schema

user_blueprint = Blueprint('user', __name__, url_prefix="/api/users")

token_key = 'x-access-token'


@user_blueprint.route('', methods=['GET'])
@token_required
def get_users(current_user):
    users = db.session.query(User).all()
    return users_schema.jsonify(users)


@user_blueprint.route('/current', methods=['GET'])
@token_required
def get_current_user(current_user):
    # Refresh access token everytime the current user object is requested
    key_data = {
        'id': current_user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    token = jwt.encode(key_data, app.config['SECRET_KEY'])

    response = user_schema.jsonify(current_user)
    response.set_cookie(token_key, token.decode('UTF-8'), httponly=True)
    return response


@user_blueprint.route('/<id>', methods=['GET'])
@token_required
def get_user(current_user, id):
    user = db.session.query(User).filter_by(id=id).first()

    if not user:
        return jsonify({'message': f'User with id {id} not found'}), 404

    return user_schema.jsonify(user)


@user_blueprint.route('', methods=['POST'])
def post_user():
    data = request.form

    if data['password'] != data['repeatPassword']:
        # Status Code might not be correct
        return jsonify({'message': 'Passwörter stimmen nicht überein', 'field': 'repeatPassword'}), 400

    email = data['email']
    if db.session.query(User.id).filter_by(email=email).scalar() is not None:
        return jsonify({'message': 'Username ist bereits vergeben', 'field': 'username'}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf8')

    new_user = User(id=str(uuid.uuid4()), email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'New user created!'})


@user_blueprint.route('', methods=['DELETE'])
@token_required
def delete_user(current_user):

    db.session.delete(current_user)
    db.session.commit()

    return jsonify({'message': 'The user has been deleted!'})


@user_blueprint.route('/login', methods=['POST'])
def post_login():
    auth = request.form

    if not auth or not auth['email'] or not auth['password']:
        return jsonify(message='Email or password incorrect'), 401

    user = db.session.query(User).filter_by(email=auth['email']).first()

    if not user:
        return jsonify(message='Email not found'), 404

    if bcrypt.check_password_hash(user.password, auth['password']):
        key_data = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }
        token = jwt.encode(key_data, app.config['SECRET_KEY'])

        response = user_schema.jsonify(user)
        response.set_cookie(token_key, token.decode('UTF-8'), httponly=True)
        return response

    return jsonify(message='Email or password incorrect'), 401


@user_blueprint.route('/logout', methods=['GET'])
@token_required
def get_logout(current_user):
    response = make_response()
    response.set_cookie(token_key, '', expires=0)
    return response
