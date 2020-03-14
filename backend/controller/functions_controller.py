from flask import Blueprint, request

from backend import db
from backend.data.models import ActivationFunction, ActivationFunctionParameter
from backend.data.schema import activation_functions_schema, activation_function_schema

functions_blueprint = Blueprint('functions', __name__, url_prefix="/api/functions")


@functions_blueprint.route('', methods=['GET'])
def get_functions():
    functions = db.session.query(ActivationFunction)

    return activation_functions_schema.jsonify(functions)


@functions_blueprint.route('', methods=['POST'])
def create_function():

    data = request.form
    name = data['name']
    # description = data['description']

    function = ActivationFunction(name=name)

    db.session.add(function)
    db.session.commit()

    return activation_function_schema.jsonify(function)


@functions_blueprint.route('/parameter', methods=['POST'])
def create_parameter():
    data = request.form
    function_id = data['functionId']
    type = data['type']
    name = data['name']
    default_value = data['defaultValue']

    parameter = ActivationFunctionParameter(activation_function_id=function_id,
                                            type=type, name=name, default_value=default_value)

    db.session.add(parameter)
    db.session.commit()

    return activation_function_schema.jsonify(db.session.Query(ActivationFunction).filter(id=function_id).first())
