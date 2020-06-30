import uuid

from flask import Blueprint, request, jsonify
from flask_jwt_extended import current_user, jwt_required

from neurodex import db
from neurodex.data.models import (ActivatorTarget, LayerType, Model,
                                  ModelActivator, ModelActivatorParameterData,
                                  ModelLayer, ModelLayerParameterData,
                                  PrimitiveValue)
from neurodex.data.schema import (model_layers_schema, model_schema,
                                  models_schema)
from neurodex.util.decorators import own_model

model_blueprint = Blueprint('model', __name__, url_prefix="/api/models")


@model_blueprint.route('', methods=['GET'])
@jwt_required
def get_models():
    models = db.session.query(Model).filter(
        Model.fk_user_id == current_user.user_id).order_by(Model.updated_at.desc()).all()

    return models_schema.jsonify(models)


@model_blueprint.route('/<model:model>', methods=['GET'])
@jwt_required
@own_model
def get_model(model):
    return model_schema.jsonify(model)


@model_blueprint.route('', methods=['POST'])
@jwt_required
def post_model():
    data = request.json
    name = data['name']

    if not name:
        return jsonify({'message': 'Der Modellname ist erforderlich'}), 422

    name_exists = db.session.query(Model).filter(
        Model.name == name, Model.fk_user_id == current_user.user_id).first() is not None

    if name_exists:
        return jsonify({'message': 'Du verwendest diesen Namen bereits'}), 422

    new_model = Model(model_id=str(uuid.uuid4()), name=data['name'], fk_user_id=current_user.user_id)

    db.session.add(new_model)
    db.session.commit()

    return model_schema.jsonify(new_model)


@model_blueprint.route('/<model:model>/name', methods=['PUT'])
@jwt_required
@own_model
def put_model_name(model):
    data = request.json
    name = data['name']

    name_exists = db.session.query(Model).filter(
        Model.name == name, Model.fk_user_id == current_user.user_id).first() is not None

    if name_exists:
        return jsonify({'message': 'Du verwendest diesen Namen bereits'}), 422

    model.name = name
    db.session.commit()
    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/layers', methods=['POST'])
@jwt_required
@own_model
def post_model_layer(model):
    data = request.json
    layer_id = data['layerId']

    layer = db.session.query(LayerType).filter(LayerType.layer_type_id == layer_id).first()
    model_layer = ModelLayer(fk_model_id=model.model_id, fk_layer_id=layer.layer_type_id, name=layer.layer_name)

    model.layers.append(model_layer)
    model.update_timestamp()
    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model_id>/layers', methods=['GET'])
@jwt_required
def get_model_layers(model_id):
    model_layers = db.session.query(ModelLayer).filter(ModelLayer.fk_model_id == model_id).all()

    return model_layers_schema.jsonify(model_layers)


@model_blueprint.route('/<model:model>/layers/<model_layer_id>', methods=['DELETE'])
@jwt_required
@own_model
def delete_model_layer(model, model_layer_id):
    """Removes a layer from a model.

    Removes a layer with a given id from a model.

    Args:
        model_id: The id of the enclosing model
        model_layer_id: The id of enclosing layer

    Returns:
        A json string containing the updated model
    """

    db.session.query(ActivatorTarget).filter(ActivatorTarget.activator_target_id == model_layer_id).delete()

    model.layers.reorder()
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/layers/<model_layer_id>/data/<parameter_name>', methods=['PUT'])
@jwt_required
def put_parameter_data(model: Model, model_layer_id: str, parameter_name: str):
    """Changes data for a parameter.

    Updates the data for a parameter in a layer of a model. The updated data should be included as the entry "value" in
    the form of the request.
    If there is no data for the parameter of this layer present a new row is inserted into the database.

    Args:
        model: The enclosing model
        model_layer_id: The id of enclosing layer
        parameter_name: The name of the parameter that was changed

    Returns:
        A json string containing the updated model
    """
    data = request.json
    new_value = data['newValue']

    param_data = db.session.query(ModelLayerParameterData).filter(
        ModelLayerParameterData.fk_model_layer_id == model_layer_id,
        ModelLayerParameterData.parameter_name == parameter_name).first()

    value = PrimitiveValue(value=new_value)

    if(param_data is None):
        param_data = ModelLayerParameterData(fk_model_layer_id=model_layer_id,
                                             parameter_name=parameter_name, value=value)

        db.session.add(param_data)
    else:
        param_data.value = value

    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/layers/<model_layer_id>/order', methods=['PUT'])
@jwt_required
def put_model_layer_order(model, model_layer_id):
    data = request.json
    index = data['index']

    model_layer = db.session.query(ModelLayer).filter(ModelLayer.model_layer_id == model_layer_id).first()

    model.layers.remove(model_layer)
    model.layers.insert(int(index), model_layer)
    model.layers.reorder()
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/activators', methods=['POST'])
@jwt_required
def post_model_activator(model: Model):
    data = request.json
    activator_id = data['activatorId']

    activator = ModelActivator(fk_activator_target_id=activator_id)

    model.activators.append(activator)
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/activators/<model_activator_id>/data/<parameter_name>', methods=['PUT'])
@jwt_required
@own_model
def put_activator_parameter_data(model: Model, model_activator_id: int, parameter_name: str):
    data = request.json
    new_value = data['newValue']

    value_entity = PrimitiveValue(value=new_value)
    parameter_data = ModelActivatorParameterData(
        fk_model_activator_id=model_activator_id, value=value_entity, parameter_name=parameter_name,)

    db.session.add(parameter_data)

    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/activators/<int:model_activator_id>/order', methods=['PUT'])
@jwt_required
@own_model
def put_activator_order(model: Model, model_activator_id: int):
    data = request.json
    new_index = data['newIndex']

    model_activator = db.session.query(ModelActivator).filter(
        ModelActivator.model_activator_id == model_activator_id).first()

    model.activators.remove(model_activator)
    model.activators.insert(int(new_index), model_activator)
    model.activators.reorder()
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/activators/<int:model_activator_id>', methods=['DELETE'])
@jwt_required
@own_model
def delete_model_activator(model: Model, model_activator_id: int):
    db.session.query(ModelActivator).filter(ModelActivator.model_activator_id == model_activator_id).delete()
    db.session.commit()

    return model_schema.jsonify(model)
