import graphene

from neurodex.graphql.mutations.function_mutations import (CreateFunction,
                                                           DeleteFunction)
from neurodex.graphql.mutations.layer_type_mutations import (CreateLayer,
                                                             DeleteLayer)
from neurodex.graphql.mutations.model_mutations import (AddModelLayer,
                                                        CreateModel,
                                                        DeleteModelLayer,
                                                        UpdateModel)


class Mutations(graphene.ObjectType):
    create_model = CreateModel.Field()
    update_model = UpdateModel.Field()
    add_model_layer = AddModelLayer.Field()
    remove_model_layer = DeleteModelLayer.Field()

    create_layer = CreateLayer.Field()
    delete_layer = DeleteLayer.Field()

    create_function = CreateFunction.Field()
    delete_function = DeleteFunction.Field()
