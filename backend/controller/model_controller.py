import uuid

from flask import Blueprint, jsonify, request

from backend import db
from backend.data.models import Model
from backend.util import token_required

model_blueprint = Blueprint('model', __name__, url_prefix="/api")


@model_blueprint.route('/models', methods=['GET'])
@token_required
def get_all_models(current_user):
    models = db.session.query(Model).filter_by(user_id=current_user.id).order_by(Model.updated_at.desc()).all()

    output = [model.to_dict() for model in models]

    return jsonify({'models': output})


@model_blueprint.route('/model/<model_id>', methods=['GET'])
@token_required
def get_model(current_user, model_id):
    model = db.session.query(Model).filter_by(id=model_id).first()
    if model.user_id != current_user.id:
        return jsonify({'message': 'Missing permissions'}), 401

    return jsonify({"model": model.to_dict()})


@model_blueprint.route('/model', methods=['POST'])
@token_required
def create_model(current_user):
    data = request.form

    new_model = Model(id=str(uuid.uuid4()), name=data['name'], user_id=current_user.id)

    db.session.add(new_model)
    db.session.commit()

    return jsonify({'id': new_model.id})


@model_blueprint.route('/model/<id>', methods=['PUT'])
@token_required
def change_model(current_user, id):
    data = request.form

    db.session.query(Model).filter_by(id=id).update({'name': data['name']})
    db.session.commit()
    return jsonify({'message': 'Model modified!'})
