from flask import send_from_directory
from backend.api import api_blueprint
from backend.model import model_blueprint
from . import app, BUILD_ROOT, db
from sqlalchemy import create_engine
from backend.data.models import Base

app.register_blueprint(api_blueprint)
app.register_blueprint(model_blueprint)

engine = create_engine('postgresql://postgres:docker@localhost/postgres', echo=True)


@app.before_first_request
def setup():
    Base.metadata.create_all(bind=db.engine)


@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path>')
def build(path):
    return send_from_directory(BUILD_ROOT, path)


if __name__ == '__main__':
    app.run()
