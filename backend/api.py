from flask import Flask, request, jsonify, make_response, Blueprint
from flask_sqlalchemy import SQLAlchemy
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from . import db, app

api_blueprint = Blueprint('api', __name__, url_prefix="/api")

class User(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(50))
    password = db.Column(db.String(80))
    admin = db.Column(db.Boolean)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try: 
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@api_blueprint.route('/users', methods=['GET'])
@token_required
def get_all_users(current_user):

    users = User.query.all()

    output = []

    for user in users:
        user_data = {}
        user_data['id'] = user.id
        user_data['name'] = user.name
        output.append(user_data)

    return jsonify({'users' : output})

@api_blueprint.route('/user/<id>', methods=['GET'])
@token_required
def get_one_user(current_user, id):
    user = User.query.filter_by(id=id).first()

    if not user:
        return jsonify({'message' : 'No user found!'})

    user_data = {}
    user_data['id'] = user.id
    user_data['name'] = user.name
    user_data['admin'] = user.admin

    return jsonify({'user' : user_data})

@api_blueprint.route('/user', methods=['POST'])
def create_user():
    data = request.form
    print(request.form)

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(id=str(uuid.uuid4()), name=data['name'], password=hashed_password, admin=False)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message' : 'New user created!'})

@api_blueprint.route('/user', methods=['PUT'])
@token_required
def promote_user(current_user):

    data = request.get_json()

    user = User.query.filter_by(id=current_user.id).first()

    if not user:
        return jsonify({'message' : 'No user found!'})

    if data['password'] != None and data['password'] != '':
        user.password = generate_password_hash(data['password'], method='sha256')

    if data['name'] != None and data['password'] != '':
        user.name = data['name']
    
    db.session.commit()

    return jsonify({'message' : 'The user has been promoted!'})

@api_blueprint.route('/user/<id>', methods=['PUT'])
@token_required
def promote_user_by_id(current_user, id):

    if current_user.admin:
        data = request.get_json()

        user = User.query.filter_by(id=id).first()

        if not user:
            return jsonify({'message' : 'No user found!'})

        if data['password'] != None and data['password'] != '':
            user.password = generate_password_hash(data['password'], method='sha256')

        if data['name'] != None and data['password'] != '':
            user.name = data['name']
        
        db.session.commit()

        return jsonify({'message' : 'The user has been promoted!'})
    else:
        return jsonify({'message' : 'You are not permitted to do that!'})


@api_blueprint.route('/user', methods=['DELETE'])
@token_required
def delete_user(current_user):

    user = User.query.filter_by(id=current_user.id).first()

    if not user:
        return jsonify({'message' : 'No user found!'})

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message' : 'The user has been deleted!'})

@api_blueprint.route('/login')
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    user = User.query.filter_by(name=auth.username).first()

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'id' : user.id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])

        return jsonify({'token' : token.decode('UTF-8')})

    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})


if __name__ == '__main__':
    app.run(debug=True)