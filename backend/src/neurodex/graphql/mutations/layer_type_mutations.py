import graphene

from neurodex import db

from neurodex.graphql.schema import LayerTypeSchema
from neurodex.data.models import LayerType, LayerTypeParameter


class LayerParameterInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    type = graphene.String(required=True)
    default_value = graphene.String(required=True)


class LayerInput(graphene.InputObjectType):
    id = graphene.String(required=True)
    description = graphene.String()
    layer_name = graphene.String(required=True)
    parameters = graphene.List(LayerParameterInput)


class CreateLayer(graphene.Mutation):
    class Meta:
        description = "Create a Layer modeled after LayerInput"

    class Arguments:
        layer_input = LayerInput(required=True)

    ok = graphene.Boolean()
    layer = graphene.Field(LayerTypeSchema)

    def mutate(root, info, layer_input):
        layer = LayerType(layer_type_id=layer_input.id, description=layer_input.description,
                          layer_name=layer_input.layer_name)

        db.session.add(layer)

        for parameter_input in layer_input.parameters:
            parameter = LayerTypeParameter(fk_layer_type_id=layer_input.id, name=parameter_input.name,
                                           type=parameter_input.type, default_value=parameter_input.default_value)
            db.session.add(parameter)

        db.session.commit()

        return CreateLayer(ok=True, layer=layer)


class DeleteLayer(graphene.Mutation):
    class Meta:
        description = "Delete a layer with a given layerId"

    class Arguments:
        layer_id = graphene.String()

    ok = graphene.Boolean()

    def mutate(root, info, layer_id):
        db.session.query(LayerType).filter(LayerType.layer_type_id == layer_id).delete()
        db.session.commit()
        return DeleteLayer(ok=True)
