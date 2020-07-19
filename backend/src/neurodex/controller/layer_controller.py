
from flask import Blueprint, request

from neurodex import db
from neurodex.data.models import LayerType, LayerTypeParameter
from neurodex.data.schema import layer_types_schema, layer_type_schema

layer_blueprint = Blueprint('layer', __name__, url_prefix="/api/layers")
