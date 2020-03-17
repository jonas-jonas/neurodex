from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt_identity, jwt_refresh_token_required,
                                set_access_cookies, set_refresh_cookies,
                                unset_jwt_cookies)

from backend import bcrypt, db, jwt
from backend.data.models import User
from backend.data.schema import user_schema

auth_blueprint = Blueprint('auth', __name__, url_prefix="/api/auth")


@jwt.user_loader_callback_loader
def user_loader_callback(identity):
    user = db.session.query(User).filter_by(id=identity).first()
    return user


@jwt.expired_token_loader
def expired_token_loader(expired_token):
    token_type = expired_token['type']
    return jsonify({
        'status': 401,
        'message': f'{token_type} token expired'
    }), 401


@auth_blueprint.route('/login', methods=['POST'])
def post_login():
    auth = request.json

    if not auth or not auth['email'] or not auth['password']:
        return jsonify(message='Email or password incorrect'), 401

    user = db.session.query(User).filter_by(email=auth['email']).first()

    if not user:
        return jsonify(message='Email not found'), 404

    if not bcrypt.check_password_hash(user.password, auth['password']):
        return jsonify(message='Email or password incorrect'), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    response = user_schema.jsonify(user)
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response


@auth_blueprint.route('/logout', methods=['GET'])
def get_logout(current_user):
    response = make_response()
    unset_jwt_cookies(response)
    return response


@auth_blueprint.route('/refresh-token', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    # Create the new access token
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)

    # Set the JWT access cookie in the response
    resp = jsonify({'status': 200})
    set_access_cookies(resp, access_token)
    return resp, 200
