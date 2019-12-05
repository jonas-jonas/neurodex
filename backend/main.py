from flask import send_from_directory
from backend.api import api_blueprint
from . import app, BUILD_ROOT

app.register_blueprint(api_blueprint)


@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path>')
def build(path):
    return send_from_directory(BUILD_ROOT, path)


if __name__ == '__main__':
    app.run()
