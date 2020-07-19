import uuid

import graphene
from flask_jwt_extended import current_user, jwt_required

from neurodex import db
from neurodex.data.models import ActivatorTarget, LayerType, Model, ModelLayer
from neurodex.graphql.schema import ModelSchema


class CreateModel(graphene.Mutation):

    class Meta:
        description = "Create a new model with a given name"

    class Arguments:
        name = graphene.String(required=True)

    model = graphene.Field(ModelSchema)
    ok = graphene.Boolean()
    error = graphene.String()

    @jwt_required
    def mutate(root, info, name):
        if not name:
            return CreateModel(ok=False, error="Ein Modellname is erforderlich")

        name_exists = db.session.query(Model).filter(
            Model.name == name, Model.fk_user_id == current_user.user_id).first() is not None

        if name_exists:
            return CreateModel(ok=False, error="Du verwendest diesen Namen bereits")

        model = Model(model_id=str(uuid.uuid4()), name=name, fk_user_id=current_user.user_id)
        db.session.add(model)
        db.session.commit()

        return CreateModel(ok=True, model=model)


class UpdateModel(graphene.Mutation):

    class Meta:
        description = "Update a model's name"

    class Arguments:
        modelId = graphene.String(required=True)
        newName = graphene.String()

    model = graphene.Field(ModelSchema)
    ok = graphene.Boolean()
    error = graphene.String()

    @jwt_required
    def mutate(root, info, newName, modelId):
        if not modelId:
            return UpdateModel(ok=False, error="Eine Modell ID ist erforderlich")

        name_exists = db.session.query(Model).filter(
            Model.name == newName, Model.fk_user_id == current_user.user_id).first() is not None

        if name_exists:
            return UpdateModel(ok=False, error="Du verwendest diesen Namen bereits")

        model = db.session.query(Model).filter(Model.model_id == modelId).first()

        if model.fk_user_id == current_user.user_id:
            return UpdateModel(ok=False, error="Dafür hast du keine Berechtigungen")

        model.name = newName

        db.session.commit()

        return UpdateModel(ok=True, model=model)


class AddModelLayer(graphene.Mutation):

    class Meta:
        description = "Add a layer to a model, to create a model layer instance"

    class Arguments:
        model_id = graphene.String()
        layer_id = graphene.String()

    model = graphene.Field(ModelSchema)
    ok = graphene.Boolean()
    error = graphene.String()

    @jwt_required
    def mutate(root, info, model_id, layer_id):
        if not model_id:
            return AddModelLayer(ok=False, error="Eine Modell ID ist erforderlich")

        if not layer_id:
            return AddModelLayer(ok=False, error="Eine Layer Id ist erforderlich")

        model = db.session.query(Model).filter(Model.model_id == model_id).first()
        layer = db.session.query(LayerType).filter(LayerType.layer_type_id == layer_id).first()

        if layer is None:
            return AddModelLayer(ok=False, error=f"Der Layer mit der ID '{layer_id}' existiert nicht")

        model_layer = ModelLayer(fk_model_id=model.model_id, fk_layer_id=layer.layer_type_id, name=layer.layer_name)

        model.layers.append(model_layer)
        model.update_timestamp()
        db.session.commit()
        return AddModelLayer(ok=True, model=model)


class DeleteModelLayer(graphene.Mutation):

    class Meta:
        description = "Removes a layer with a given id from a model"

    class Arguments:
        model_id = graphene.String()
        model_layer_id = graphene.Int()

    model = graphene.Field(ModelSchema)
    ok = graphene.Boolean()
    error = graphene.String()

    @jwt_required
    def mutate(root, info, model_id, model_layer_id):
        if not model_id:
            return DeleteModelLayer(ok=False, error="Eine Modell ID ist erforderlich")

        if not model_layer_id:
            return DeleteModelLayer(ok=False, error="Eine Model Layer Id ist erforderlich")

        model = db.session.query(Model).filter(Model.model_id == model_id).first()
        db.session.query(ActivatorTarget).filter(ActivatorTarget.activator_target_id == model_layer_id).delete()
        model.layers.reorder()

        model.update_timestamp()
        db.session.commit()
        return DeleteModelLayer(ok=True, model=model)
