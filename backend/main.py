from flask import send_from_directory

from backend import BUILD_ROOT, app, db
from backend.controller.model_controller import model_blueprint
from backend.controller.user_controller import user_blueprint
from backend.data.models import Base

app.register_blueprint(user_blueprint)
app.register_blueprint(model_blueprint)


@app.before_first_request
def setup():
    Base.metadata.create_all(bind=db.engine)


@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path>')
def build(path):
    return send_from_directory(BUILD_ROOT, path)


if __name__ == '__main__':
    app.run()
