from flask import Blueprint, jsonify, request

from backend import db
from backend.data.models import ActivationFunction, ActivationFunctionParameter

functions_blueprint = Blueprint('functions', __name__, url_prefix="/api/functions")


@functions_blueprint.route('', methods=['GET'])
def get_functions():
    functions = db.session.query(ActivationFunction)

    output = [function.to_dict() for function in functions]

    return jsonify({'functions': output}), 200


@functions_blueprint.route('', methods=['POST'])
def create_function():

    data = request.form
    name = data['name']
    # description = data['description']

    function = ActivationFunction(name=name)

    db.session.add(function)
    db.session.commit()

    return jsonify({'function': function.to_dict()}), 200


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

    return jsonify({'parameter': parameter.to_dict()}), 200
