
from flask import Blueprint, request

from backend import db
from backend.data.models import LayerType, LayerParameter
from backend.data.schema import layer_types_schema, layer_type_schema

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

    A POST endpoint that creates a new layer from data supplied by request.form.

    Returns:
        A json string containing the newly created layer
    """
    data = request.form
    id = data['id']
    description = data['description']
    layer_name = data['layerName']

    layer = LayerType(id=id, description=description, layer_name=layer_name)

    db.session.add(layer)
    db.session.commit()

    return layer_type_schema.jsonify(layer)


@layer_blueprint.route('<layer_id>/parameter/', methods=['POST'])
def post_parameter(layer_id):
    data = request.form
    name = data['name']
    type = data['type']
    default_value = data['defaultValue']

    layer_parameter = LayerParameter(layer_type_id=layer_id, name=name, type=type, default_value=default_value)

    db.session.add(layer_parameter)
    db.session.commit()

    layer = db.session.query(LayerType).filter_by(id=layer_id).first()

    return layer_type_schema.jsonify(layer)
