from flask import request, jsonify, make_response, Blueprint
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from backend.data.models import User
from . import app, db

api_blueprint = Blueprint('api', __name__, url_prefix="/api")

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


@api_blueprint.route('/users', methods=['GET'])
@token_required
def get_all_users(current_user):

    users = db.session.query(User).all()

    output = []

    for user in users:
        user_data = {}
        user_data['id'] = user.id
        user_data['name'] = user.name
        output.append(user_data)

    return jsonify({'users': output})


@api_blueprint.route('/user', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()})


@api_blueprint.route('/user/<id>', methods=['GET'])
@token_required
def get_one_user(current_user, id):
    user = db.session.query(User).filter_by(id=id).first()

    if not user:
        return jsonify({'message': 'No user found!'}), 404

    user_data = {}
    user_data['id'] = user.id
    user_data['name'] = user.name
    user_data['admin'] = user.admin

    return jsonify({'user': user.to_dict()})


@api_blueprint.route('/user', methods=['POST'])
def create_user():
    data = request.form

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(id=str(uuid.uuid4()),
                    username=data['username'], password=hashed_password, admin=False)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'New user created!'})


@api_blueprint.route('/user', methods=['PUT'])
@token_required
def promote_user(current_user):

    data = request.get_json()

    user = db.session.query(User).filter_by(id=current_user.id).first()

    if not user:
        return jsonify({'message': 'No user found!'}), 404

    if data['password'] is not None and data['password'] != '':
        user.password = generate_password_hash(
            data['password'], method='sha256')

    if data['username'] is not None and data['password'] != '':
        user.username = data['username']

    db.session.commit()

    return jsonify({'message': 'The user has been promoted!'})


@api_blueprint.route('/user/<id>', methods=['PUT'])
@token_required
def promote_user_by_id(current_user, id):

    if current_user.admin:
        data = request.get_json()

        user = db.session.query(User).filter_by(id=id).first()

        if not user:
            return jsonify({'message': 'No user found!'}), 404

        if data['password'] is not None and data['password'] != '':
            user.password = generate_password_hash(
                data['password'], method='sha256')

        if data['username'] is not None and data['password'] != '':
            user.username = data['username']

        db.session.commit()

        return jsonify({'message': 'The user has been promoted!'})
    else:
        return jsonify({'message': 'You are not permitted to do that!'}), 401


@api_blueprint.route('/user', methods=['DELETE'])
@token_required
def delete_user(current_user):

    user = db.session.query(User).filter_by(id=current_user.id).first()

    if not user:
        return jsonify({'message': 'No user found!'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'The user has been deleted!'})


@api_blueprint.route('/login', methods=['POST'])
def login():
    auth = request.form

    if not auth or not auth['username'] or not auth['password']:
        return jsonify(message='Username or password incorrect'), 401

    user = db.session.query(User).filter_by(username=auth['username']).first()

    if not user:
        return jsonify(message='Username not found'), 404

    if check_password_hash(user.password, auth['password']):
        key_data = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }
        token = jwt.encode(key_data, app.config['SECRET_KEY'])

        response = jsonify({'user': user.to_dict()})
        response.set_cookie(token_key, token.decode('UTF-8'), httponly=True)
        return response

    return jsonify(message='Username or password incorrect'), 401


@api_blueprint.route('/logout', methods=['GET'])
@token_required
def logout(current_user):
    response = make_response()
    response.set_cookie(token_key, '', expires=0)
    return response
