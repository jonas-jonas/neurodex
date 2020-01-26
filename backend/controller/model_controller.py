import uuid

from flask import Blueprint, jsonify, request

from backend import db
from backend.data.models import (ActivationFunctionParameter, LayerType,
                                 LayerValue, Model, ModelFunction,
                                 ModelFunctionParameterData, ModelLayer,
                                 ModelLayerParameterData, PrimitiveValue)
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
    model.update_timestamp()
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
    model.update_timestamp()

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

    model = db.session.query(Model).filter_by(id=model_id).first()
    model.update_timestamp()

    db.session.commit()

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
    model.update_timestamp()

    db.session.commit()

    return jsonify({'model': model.to_dict()}), 200


@model_blueprint.route('/<model_id>/functions', methods=['POST'])
@token_required
def add_function(current_user, model_id):
    data = request.form
    function_id = data['functionId']

    model_function = ModelFunction(model_id=model_id, activation_function_id=function_id)
    model = db.session.query(Model).filter_by(id=model_id).first()

    model.functions.append(model_function)
    model.update_timestamp()

    db.session.commit()

    return jsonify({'model': model.to_dict()}), 200


@model_blueprint.route('/<model_id>/functions/<function_id>', methods=['DELETE'])
@token_required
def remove_function(current_user, model_id, function_id):
    db.session.query(ModelFunction).filter_by(id=function_id).delete()
    model = db.session.query(Model).filter_by(id=model_id).first()

    model.layers.reorder()
    model.update_timestamp()

    db.session.commit()

    return jsonify({'model': model.to_dict()}), 200


@model_blueprint.route('/<model_id>/functions/<model_function_id>/activator', methods=['PUT'])
@token_required
def update_activator(current_user, model_id, model_function_id):
    data = request.form
    activation_function_id = data['functionId']

    # function = db.session.query(ActivatorFunction).filter_by(id=activator_function_id).first()

    db.session.query(ModelFunction).filter_by(
        id=model_function_id).update({'activation_function_id': activation_function_id})

    db.session.commit()
    model.update_timestamp()

    model = db.session.query(Model).filter_by(id=model_id).first()

    return jsonify({'model': model.to_dict()}), 200


@model_blueprint.route('/<model_id>/functions/<model_function_id>/data/<parameter_name>', methods=['PUT'])
@token_required
def update_model_function_parameter(current_user, model_id, model_function_id, parameter_name):
    """Changes data for a parameter.

    Updates the data for a parameter in a layer of a model. The updated data should be included as the entry "value" in
    the form of the request.
    If there is no data for the parameter of this layer present a new row is inserted into the database.

    Args:
        current_user: The currently logged in user object.
        model_id: The id of the enclosing model
        model_function_id: The id of function
        parameter_name: The name of the parameter that was changed (or added)

    Returns:
        A json string containing the updated model
    """
    data = request.form

    model_function = db.session.query(ModelFunction).filter_by(id=model_function_id).first()

    function_id = model_function.function.id

    param = db.session.query(ActivationFunctionParameter).filter_by(activation_function_id=function_id, name=parameter_name).first()

    if param.type == "layer":
        value = LayerValue(value_id=data['value'])
    else:
        value = PrimitiveValue(value=data['value'])

    param_data = db.session.query(ModelFunctionParameterData).filter_by(
        model_function_id=model_function_id, activation_function_parameter_id=param.id).first()

    if(param_data is None):
        param_data = ModelFunctionParameterData(model_function_id=model_function_id,
                                                activation_function_parameter_id=param.id, value=value)

        db.session.add(param_data)
    else:
        param_data.value = value

    model = db.session.query(Model).filter_by(id=model_id).first()
    model.update_timestamp()

    db.session.commit()

    return jsonify({'model': model.to_dict()}), 200
