from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from neurodex import db
from neurodex.data.models import Model, User
from neurodex.data_importer.importer import get_layers
from neurodex.util.decorators import needs_role

admin_blueprint = Blueprint('admin', __name__, url_prefix="/api/admin/")


@admin_blueprint.route("/stats", methods=["GET"])
@jwt_required
@needs_role("ADMIN")
def get_stats():
    user_count = db.session.query(User).count()
    model_count = db.session.query(Model).count()
    return jsonify({'userCount': user_count, 'modelCount': model_count})


@admin_blueprint.route("/import", methods=["PUT"])
@jwt_required
@needs_role("ADMIN")
def put_import():
    layer_types, layer_type_parameters = get_layers()
    db.session.bulk_save_objects(layer_types)
    db.session.bulk_save_objects(layer_type_parameters)
    db.session.commit()
    return jsonify({"message": "success"})
