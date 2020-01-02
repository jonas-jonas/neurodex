
from flask import Blueprint, jsonify, request

from backend import db
from backend.data.models import LayerType

layer_blueprint = Blueprint('layer', __name__, url_prefix="/api/layer")


@layer_blueprint.route('', methods=['GET'])
def get_all_layers():
    """Returns all layers that are currently available.

    Returns:
        A json string containing all layers
    """
    layers = db.session.query(LayerType).all()

    output = [layer.to_dict() for layer in layers]

    return jsonify({'layers': output}), 200


@layer_blueprint.route('', methods=['POST'])
def create_layer():
    """Creates a new layer.

    A POST endpoint that creates a new layer from data supplied by request.form.

    Returns:
        A json string containing the newly created layer
    """
    data = request.form

    layer = LayerType(id=data['id'], description=data['description'])

    db.session.add(layer)
    db.session.commit()

    return jsonify({'layer': layer.to_dict()}), 200
