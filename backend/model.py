import datetime
import uuid
from datetime import datetime
from functools import wraps
import jwt
from flask import Blueprint, jsonify, make_response, request
from sqlalchemy import (TIMESTAMP, Boolean, Column, DateTime, Float,
                        ForeignKey, Integer, String, Text)
from werkzeug.security import check_password_hash, generate_password_hash

from . import app, db
from backend.data.models import Model, User

model_blueprint = Blueprint('model', __name__, url_prefix="/api")

token_key = 'x-access-token'


@model_blueprint.route('/models', methods=['GET'])
def get_all_models():

    models = session.query(Model)
    output = []
    for model in models:
        output.append(model.__dict__)

    return jsonify({'users': output})


@model_blueprint.route('/model', methods=['POST'])
def create_model():
    data = request.form

    new_model = Model(id=str(uuid.uuid4()),
                      name=data['name'],
                      owner='1')

    session.add(new_model)
    session.commit()

    return jsonify({'message': 'New model created!'})
