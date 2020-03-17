from flask import send_from_directory

from backend import BUILD_ROOT, app, db
from backend.controller.authentication_controller import auth_blueprint
from backend.controller.error_controller import internal_error, page_not_found
from backend.controller.functions_controller import functions_blueprint
from backend.controller.layer_controller import layer_blueprint
from backend.controller.model_controller import model_blueprint
from backend.controller.user_controller import user_blueprint
from backend.converter.model_converter import ModelConverter
from backend.data.models import Base
from backend.util import CustomJSONEncoder, init_db

app.url_map.converters['model'] = ModelConverter
app.register_blueprint(auth_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(model_blueprint)
app.register_blueprint(layer_blueprint)
app.register_blueprint(functions_blueprint)
app.register_error_handler(404, page_not_found)
app.register_error_handler(500, internal_error)
app.json_encoder = CustomJSONEncoder


@app.before_first_request
def setup():
    Base.metadata.create_all(bind=db.engine)
    init_db()


@app.route('/')
@app.route('/<path:path>')
def build(path=None):
    return send_from_directory(BUILD_ROOT, 'index.html')


if __name__ == '__main__':
    app.run()
