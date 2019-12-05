from backend.api import api_blueprint
from . import app

app.register_blueprint(api_blueprint)


@app.route('/<path:path>')
def build(path):
    return app.send_static_file(path)


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run()
