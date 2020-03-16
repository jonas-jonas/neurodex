import uuid

from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required

from backend import bcrypt, db
from backend.data.models import User
from backend.data.schema import user_schema, users_schema

user_blueprint = Blueprint('user', __name__, url_prefix="/api/users")

token_key = 'x-access-token'


@user_blueprint.route('', methods=['GET'])
@jwt_required
def get_users():
    users = db.session.query(User).all()
    return users_schema.jsonify(users)


@user_blueprint.route('/current', methods=['GET'])
@jwt_required
def get_current_user():
    return user_schema.jsonify(current_user)


@user_blueprint.route('/<id>', methods=['GET'])
@jwt_required
def get_user(id):
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
@jwt_required
def delete_user():

    db.session.delete(current_user)
    db.session.commit()

    return jsonify({'message': 'The user has been deleted!'})
