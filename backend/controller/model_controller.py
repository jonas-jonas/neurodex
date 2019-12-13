import uuid

from flask import Blueprint, jsonify, request

from backend import db
from backend.data.models import Model
from backend.util import token_required

model_blueprint = Blueprint('model', __name__, url_prefix="/api")

token_key = 'x-access-token'


@model_blueprint.route('/models', methods=['GET'])
@token_required
def get_all_models(current_user):
    models = db.session.query(Model).filter_by(owner=current_user.id).first()
    # if models is not None:
    output = []
    if models is not None:
        output = [dict(model) for model in models]

    return jsonify({'models': output})


@model_blueprint.route('/model', methods=['POST'])
@token_required
def create_model(current_user):
    data = request.form

    new_model = Model(id=str(uuid.uuid4()), name=data['name'], owner=current_user.id)

    db.session.add(new_model)
    db.session.commit()

    return jsonify({'message': 'New model created!'})


@model_blueprint.route('/model/<id>', methods=['PUT'])
@token_required
def change_model(current_user, id):
    data = request.form

    db.session.query(Model).filter_by(id=id).update({'name': data['name']})
    db.session.commit()
    return jsonify({'message': 'Model modified!'})
