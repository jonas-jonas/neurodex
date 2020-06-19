from neurodex import redis, db

from neurodex.data.models import Function, FunctionParameter
from neurodex.data.schema import activation_functions_schema, activation_function_schema


def get_all_functions():
    functions_as_json = None
    if redis.exists("functions"):
        functions_as_json = redis.get("functions")
    else:
        functions = db.session.query(Function).all()
        functions_as_json = activation_functions_schema.jsonify(functions)
        redis.set("functions", functions_as_json.data)
    return functions_as_json
