from werkzeug.routing import BaseConverter

from neurodex import db
from neurodex.data.models import Model


class ModelConverter(BaseConverter):

    def to_python(self, model_id):
        # value should be the model_id
        return db.session.query(Model).filter_by(id=model_id).first()

    def to_url(self, model):
        return model.id
