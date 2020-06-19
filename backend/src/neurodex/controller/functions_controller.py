from flask import Blueprint, request

from neurodex import db
from neurodex.data.models import Function, FunctionParameter
from neurodex.data.schema import activation_functions_schema, activation_function_schema

from neurodex.service.functions_service import get_all_functions

functions_blueprint = Blueprint('functions', __name__, url_prefix="/api/functions")


@functions_blueprint.route('', methods=['GET'])
def get_functions():
    # functions = db.session.query(Function).all()

    return get_all_functions()


@functions_blueprint.route('', methods=['POST'])
def post_function():

    data = request.json
    name = data['name']
    # description = data['description']

    function = Function(name=name)

    db.session.add(function)
    db.session.commit()

    return activation_function_schema.jsonify(function)


@functions_blueprint.route('/<function_id>/parameter', methods=['POST'])
def post_parameter(function_id):
    data = request.json
    type = data['type']
    name = data['name']
    default_value = data['defaultValue']

    parameter = FunctionParameter(fk_function_id=function_id, type=type, name=name, default_value=default_value)

    db.session.add(parameter)
    db.session.commit()

    function = db.session.query(Function).filter(Function.function_id == function_id).first()

    return activation_function_schema.jsonify(function)
