from flask import jsonify, send_from_directory
from werkzeug.exceptions import HTTPException

from neurodex import BUILD_ROOT, app, db
from neurodex.controller.admin_controller import admin_blueprint
from neurodex.controller.authentication_controller import auth_blueprint
from neurodex.controller.functions_controller import functions_blueprint
from neurodex.controller.layer_controller import layer_blueprint
from neurodex.controller.model_controller import model_blueprint
from neurodex.controller.user_controller import user_blueprint
from neurodex.converter.model_converter import ModelConverter
from neurodex.data.models import Base
from neurodex.util import CustomJSONEncoder, init_db
from flask_graphql import GraphQLView
from neurodex.graphql import schema as graphql_schema

app.url_map.converters['model'] = ModelConverter
app.register_blueprint(auth_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(model_blueprint)
app.register_blueprint(layer_blueprint)
app.register_blueprint(functions_blueprint)
app.register_blueprint(admin_blueprint)
app.json_encoder = CustomJSONEncoder

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=graphql_schema,
        graphiql=True,
        get_context=lambda: {'session': db.session}
    ))


@app.before_first_request
def setup():
    Base.metadata.create_all(bind=db.engine)
    init_db()


@app.errorhandler(HTTPException)
def error_handler(e):
    result = {
        'code': e.code,
        'message': e.description
    }
    return jsonify(result), e.code


@app.route('/')
@app.route('/<path:path>')
def build(path=None):
    return send_from_directory(BUILD_ROOT, 'index.html')


if __name__ == '__main__':
    app.run()
