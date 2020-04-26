
from flask import Blueprint, request

from neurodex import db
from neurodex.data.models import LayerType, LayerTypeParameter
from neurodex.data.schema import layer_types_schema, layer_type_schema

layer_blueprint = Blueprint('layer', __name__, url_prefix="/api/layers")


@layer_blueprint.route('', methods=['GET'])
def get_layers():
    """Returns all layers that are currently available.

    Returns:
        A json string containing all layers
    """
    layers = db.session.query(LayerType).all()

    return layer_types_schema.jsonify(layers)


@layer_blueprint.route('', methods=['POST'])
def post_layer():
    """Creates a new layer.

    A POST endpoint that creates a new layer from data supplied by request.json.

    Returns:
        A json string containing the newly created layer
    """
    data = request.json
    id = data['id']
    description = data['description']
    layer_name = data['layerName']

    layer = LayerType(id=id, description=description, layer_name=layer_name)

    db.session.add(layer)
    db.session.commit()

    return layer_type_schema.jsonify(layer)


@layer_blueprint.route('<layer_id>/parameter/', methods=['POST'])
def post_parameter(layer_id):
    data = request.json
    name = data['name']
    type = data['type']
    default_value = data['defaultValue']

    layer_parameter = LayerTypeParameter(layer_type_id=layer_id, name=name, type=type, default_value=default_value)

    db.session.add(layer_parameter)
    db.session.commit()

    layer = db.session.query(LayerType).filter_by(id=layer_id).first()

    return layer_type_schema.jsonify(layer)
