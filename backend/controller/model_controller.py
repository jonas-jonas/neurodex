import uuid

from flask import Blueprint, request
from flask_jwt_extended import current_user, jwt_required

from backend import db
from backend.data.models import (FunctionParameter, LayerType, LayerValue,
                                 Model, ModelFunction,
                                 ModelFunctionParameterData, ModelLayer,
                                 ModelLayerParameterData, PrimitiveValue)
from backend.data.schema import (model_functions_schema, model_layers_schema,
                                 model_schema, models_schema)
from backend.util.decorators import own_model

model_blueprint = Blueprint('model', __name__, url_prefix="/api/models")


@model_blueprint.route('', methods=['GET'])
@jwt_required
def get_models():
    models = db.session.query(Model).filter_by(user_id=current_user.id).order_by(Model.updated_at.desc()).all()

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

    new_model = Model(id=str(uuid.uuid4()), name=data['name'], user_id=current_user.id)

    db.session.add(new_model)
    db.session.commit()

    return model_schema.jsonify(new_model)


@model_blueprint.route('/<model:model>/name', methods=['PUT'])
@jwt_required
@own_model
def put_model_name(model):
    data = request.json

    model.name = data['name']
    db.session.commit()
    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/layers', methods=['POST'])
@jwt_required
@own_model
def post_model_layer(model):
    data = request.json
    layer_id = data['layerId']

    layer = db.session.query(LayerType).filter_by(id=layer_id).first()

    # TODO: Change to a better system
    layer_count = db.session.query(ModelLayer).filter_by(model_id=model.id, layer_id=layer.id).count()

    model_layer = ModelLayer(model_id=model.id, layer_id=layer.id, layer_name=f"{layer.layer_name}{layer_count+1}")

    model.layers.append(model_layer)
    model.update_timestamp()
    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model_id>/layers', methods=['GET'])
@jwt_required
def get_model_layers(model_id):
    model_layers = db.session.query(ModelLayer).filter_by(model_id=model_id).all()

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

    db.session.query(ModelLayer).filter_by(model_id=model.id, id=model_layer_id).delete()

    model.layers.reorder()
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model_id>/layers/<model_layer_id>/data/<parameter_name>', methods=['PUT'])
@jwt_required
def put_parameter_data(model_id, model_layer_id, parameter_name):
    """Changes data for a parameter.

    Updates the data for a parameter in a layer of a model. The updated data should be included as the entry "value" in
    the form of the request.
    If there is no data for the parameter of this layer present a new row is inserted into the database.

    Args:
        model_id: The id of the enclosing model
        model_layer_id: The id of enclosing layer
        parameter_name: The name of the parameter that was changed

    Returns:
        A json string containing the updated model
    """
    data = request.json

    param_data = db.session.query(ModelLayerParameterData).filter_by(
        model_layer_id=model_layer_id, parameter_name=parameter_name).first()

    value = PrimitiveValue(value=data['value'])

    if(param_data is None):
        param_data = ModelLayerParameterData(model_layer_id=model_layer_id,
                                             parameter_name=parameter_name, value=value)

        db.session.add(param_data)
    else:
        param_data.value = value

    model = db.session.query(Model).filter_by(id=model_id).first()
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/layers/<model_layer_id>/order', methods=['PUT'])
@jwt_required
def put_model_layer_order(model, model_layer_id):
    data = request.json
    index = data['index']

    model_layer = db.session.query(ModelLayer).filter_by(id=model_layer_id).first()

    model.layers.remove(model_layer)
    model.layers.insert(int(index), model_layer)
    model.layers.reorder()
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/functions', methods=['POST'])
@jwt_required
def post_function(model):
    data = request.json
    function_id = data['functionId']

    model_function = ModelFunction(model_id=model.id, function_id=function_id)

    model.functions.append(model_function)
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model_id>/functions', methods=['GET'])
@jwt_required
def get_model_functions(model_id):
    model_functions = db.session.query(ModelFunction).filter_by(model_id=model_id).all()

    return model_functions_schema.jsonify(model_functions)


@model_blueprint.route('/<model:model>/functions/<function_id>', methods=['DELETE'])
@jwt_required
def delete_function(model: Model, function_id):
    db.session.query(ModelFunction).filter_by(id=function_id).delete()

    model.functions.reorder()
    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/functions/<model_function_id>/activator', methods=['PUT'])
@jwt_required
def put_model_function(model, model_function_id):
    data = request.json
    function_id = data['functionId']

    # function = db.session.query(ActivatorFunction).filter_by(id=activator_function_id).first()

    function = db.session.query(ModelFunction).filter_by(id=model_function_id).first()

    function.function_id = function_id

    db.session.commit()
    model.update_timestamp()

    return model_schema.jsonify(model)


@model_blueprint.route('/<model:model>/functions/<model_function_id>/data/<parameter_name>', methods=['PUT'])
@jwt_required
def put_model_function_parameter(model, model_function_id, parameter_name):
    """Changes data for a parameter.

    Updates the data for a parameter in a layer of a model. The updated data should be included as the entry "value" in
    the form of the request.
    If there is no data for the parameter of this layer present a new row is inserted into the database.

    Args:
        model_id: The id of the enclosing model
        model_function_id: The id of function
        parameter_name: The name of the parameter that was changed (or added)

    Returns:
        A json string containing the updated model
    """
    data = request.json

    model_function = db.session.query(ModelFunction).filter_by(id=model_function_id).first()

    function_id = model_function.function.id

    param = db.session.query(FunctionParameter).filter_by(function_id=function_id, name=parameter_name).first()

    if param.type == "layer":
        value = LayerValue(value_id=data['value'])
    else:
        value = PrimitiveValue(value=data['value'])

    param_data = db.session.query(ModelFunctionParameterData).filter_by(
        model_function_id=model_function_id, parameter_name=param.name).first()

    if(param_data is None):
        param_data = ModelFunctionParameterData(model_function_id=model_function_id,
                                                parameter_name=param.name, value=value)

        db.session.add(param_data)
    else:
        param_data.value = value

    model.update_timestamp()

    db.session.commit()

    return model_schema.jsonify(model)
