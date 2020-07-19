import graphene
from neurodex.graphql.schema import Query
from neurodex.graphql.mutations import Mutations

schema = graphene.Schema(query=Query, mutation=Mutations)
