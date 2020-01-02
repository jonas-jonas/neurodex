import uuid

from flask import Blueprint, jsonify, request

from backend import db
from backend.data.models import Model, LayerType, ModelLayer, ModelLayerParameterData
from backend.util import token_required

model_blueprint = Blueprint('model', __name__, url_prefix="/api/model")


@model_blueprint.route('', methods=['GET'])
@token_required
def get_all_models(current_user):
    models = db.session.query(Model).filter_by(user_id=current_user.id).order_by(Model.updated_at.desc()).all()

    output = [model.to_dict() for model in models]

    return jsonify({'models': output})


@model_blueprint.route('/<model_id>', methods=['GET'])
@token_required
def get_model(current_user, model_id):
    model = db.session.query(Model).filter_by(id=model_id).first()
    if model.user_id != current_user.id:
        return jsonify({'message': 'Missing permissions'}), 401

    return jsonify({"model": model.to_dict()})


@model_blueprint.route('', methods=['POST'])
@token_required
def create_model(current_user):
    data = request.form

    new_model = Model(id=str(uuid.uuid4()), name=data['name'], user_id=current_user.id)

    db.session.add(new_model)
    db.session.commit()

    return jsonify({'id': new_model.id})


@model_blueprint.route('/<model_id>', methods=['PUT'])
@token_required
def change_model(current_user, model_id):
    data = request.form

    db.session.query(Model).filter_by(id=model_id).update({'name': data['name']})
    db.session.commit()
    return jsonify({'message': 'Model modified!'})


@model_blueprint.route('/<model_id>/layer', methods=['POST'])
@token_required
def add_model_layer(current_user, model_id):
    data = request.form
    layer_id = data['layerId']

    layer = db.session.query(LayerType).filter_by(id=layer_id).first()
    model = db.session.query(Model).filter_by(id=model_id).first()

    # TODO: Change to a better system
    layer_count = db.session.query(ModelLayer).filter_by(model_id=model.id, layer_id=layer.id).count()

    model_layer = ModelLayer(model_id=model.id, layer_id=layer.id, layer_name=f"{layer.layer_name}{layer_count+1}")

    model.layers.append(model_layer)

    db.session.commit()

    return jsonify({'model': model.to_dict()}), 200


@model_blueprint.route('/<model_id>/layer/<model_layer_id>', methods=['DELETE'])
@token_required
def remove_model_layer(current_user, model_id, model_layer_id):
    """Removes a layer from a model.

    Removes a layer with a given id from a model.

    Args:
        current_user: The currently logged in user
        model_id: The id of the enclosing model
        model_layer_id: The id of enclosing layer

    Returns:
        A json string containing the updated model
    """
    model = db.session.query(Model).filter_by(id=model_id).first()

    db.session.query(ModelLayer).filter_by(model_id=model_id, id=model_layer_id).delete()

    model.layers.reorder()

    db.session.commit()

    return jsonify({'model': model.to_dict()}), 200


@model_blueprint.route('/<model_id>/layer/<model_layer_id>/data/<parameter_name>', methods=['PUT'])
@token_required
def update_parameter_data(current_user, model_id, model_layer_id, parameter_name):
    """Changes data for a parameter.

    Updates the data for a parameter in a layer of a model. The updated data should be included as the entry "value" in
    the form of the request.
    If there is no data for the parameter of this layer present a new row is inserted into the database.

    Args:
        current_user: The currently logged in user object.
        model_id: The id of the enclosing model
        model_layer_id: The id of enclosing layer
        parameter_name: The name of the parameter that was changed

    Returns:
        A json string containing the updated model
    """
    data = request.form

    param_data = db.session.query(ModelLayerParameterData).filter_by(
        model_layer_id=model_layer_id, parameter_name=parameter_name).first()

    if(param_data is None):
        param_data = ModelLayerParameterData(model_layer_id=model_layer_id,
                                             parameter_name=parameter_name, value=data['value'])

        db.session.add(param_data)
    else:
        param_data.value = data['value']

    db.session.commit()

    model = db.session.query(Model).filter_by(id=model_id).first()

    return jsonify({'model': model.to_dict()}), 200


@model_blueprint.route('/<model_id>/layer/<model_layer_id>/order', methods=['PUT'])
@token_required
def update_order(current_user, model_id, model_layer_id):
    data = request.form
    index = data['index']

    model_layer = db.session.query(ModelLayer).filter_by(id=model_layer_id).first()
    model = db.session.query(Model).filter_by(id=model_id).first()

    model.layers.remove(model_layer)
    model.layers.insert(int(index), model_layer)
    model.layers.reorder()

    db.session.commit()

    return jsonify({'model': model.to_dict()}), 200
