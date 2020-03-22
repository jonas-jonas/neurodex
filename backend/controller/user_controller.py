import uuid

from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required

from backend import bcrypt, db
from backend.data.models import User, UserMetadata
from backend.data.schema import user_schema, users_schema
from backend.util.decorators import needs_role

from backend.service.email_service import send_confirmation_email
import re

user_blueprint = Blueprint('user', __name__, url_prefix="/api/users")

email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"

token_key = 'x-access-token'


@user_blueprint.route('', methods=['GET'])
@jwt_required
@needs_role("admin")
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
    data = request.json

    if data['password'] != data['repeatPassword']:
        # Status Code might not be correct
        return jsonify({'message': 'Passwörter stimmen nicht überein', 'field': 'repeatPassword'}), 400

    email = data['email']
    if not re.search(email_regex, email):
        return jsonify({'message': 'Keine gültige E-Mail Adresse', 'field': 'email'}), 400

    if db.session.query(User.id).filter_by(email=email).scalar() is not None:
        return jsonify({'message': 'E-Mail Adresse wird bereits benutzt', 'field': 'email'}), 400

    confirmation_id = str(uuid.uuid4())

    try:
        send_confirmation_email(confirmation_id, email, data['name'])
    except Exception as error:
        print(error.body)
        return jsonify({'message': 'Keine gültige E-Mail Adresse', 'field': 'email'}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf8')

    new_user = User(id=str(uuid.uuid4()), email=email,
                    password=hashed_password, name=data['name'])

    user_metadata = UserMetadata(confirmation_id=confirmation_id)
    new_user.user_metadata = user_metadata
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'success'}), 200


@user_blueprint.route('/confirm-email', methods=['POST'])
def post_confirmation_id():
    data = request.json
    metadata = db.session.query(UserMetadata).filter_by(confirmation_id=data['confirmationId']).first()
    if metadata is None:
        return jsonify({'message': 'Dieser Bestätigungslink ist abgelaufen.'}), 400

    metadata.confirmation_id = None

    db.session.commit()

    return jsonify({'message': 'Success'})


@user_blueprint.route('', methods=['DELETE'])
@jwt_required
def delete_user():

    db.session.delete(current_user)
    db.session.commit()

    return jsonify({'message': 'The user has been deleted!'})


@user_blueprint.route('/update/data', methods=['PUT'])
@jwt_required
def update_data():

    data = request.json

    current_user.name = data['name']
    current_user.email = data['email']

    db.session.commit()

    return user_schema.jsonify(current_user)


@user_blueprint.route('/update/password', methods=['PUT'])
@jwt_required
def update_password():

    data = request.json

    if not bcrypt.check_password_hash(current_user.password, data['oldPassword']):
        return jsonify({'message': 'Password incorrect', 'field': 'oldPassword'}), 401

    if data['password'] != data['repeatPassword']:
        # Status Code might not be correct
        return jsonify({'message': 'Passwörter stimmen nicht überein', 'field': 'repeatPassword'}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf8')
    current_user.password = hashed_password

    db.session.commit()

    return user_schema.jsonify(current_user)
