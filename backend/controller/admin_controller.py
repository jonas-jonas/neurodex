import torch
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from backend import db
from backend.data.models import Model, User, LayerType
from backend.util.decorators import needs_role
from backend.data.schema import layer_types_schema

admin_blueprint = Blueprint('admin', __name__, url_prefix="/api/admin/")


@admin_blueprint.route("/stats", methods=["GET"])
@jwt_required
@needs_role("ADMIN")
def get_stats():
    user_count = db.session.query(User).count()
    model_count = db.session.query(Model).count()
    return jsonify({'userCount': user_count, 'modelCount': model_count, 'torchVersion': torch.version.__version__})


@admin_blueprint.route("/layers", methods=["GET"])
@jwt_required
@needs_role("ADMIN")
def get_layers():

    layers = db.session.query(LayerType).all()

    return layer_types_schema.jsonify(layers)
