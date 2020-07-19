import graphene

from neurodex import db
from neurodex.data.models import Function, FunctionParameter
from neurodex.graphql.schema import FunctionSchema


class FunctionParameterInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    type = graphene.String(required=True)
    default_value = graphene.String(required=True)


class FunctionInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    description = graphene.String()
    parameters = graphene.List(FunctionParameterInput)


class CreateFunction(graphene.Mutation):
    class Meta:
        description = "Create a Function modeled after FunctionInput"

    class Arguments:
        function_input = FunctionInput(required=True)

    ok = graphene.Boolean()
    function = graphene.Field(FunctionSchema)

    def mutate(root, info, function_input: FunctionInput):
        function = Function(description=function_input.description, name=function_input.name)

        db.session.add(function)

        if function_input.parameters is not None:
            for parameter_input in function_input.parameters:
                parameter = FunctionParameter(fk_function_id=function.id, name=parameter_input.name,
                                              type=parameter_input.type, default_value=parameter_input.default_value)
                db.session.add(parameter)

        db.session.commit()

        return CreateFunction(ok=True, function=function)


class DeleteFunction(graphene.Mutation):
    class Meta:
        description = "Delete a function with a given functionId"

    class Arguments:
        function_id = graphene.String()

    ok = graphene.Boolean()

    def mutate(root, info, function_id):
        db.session.query(Function).filter(Function.function_id == function_id).delete()
        db.session.commit()
        return DeleteFunction(ok=True)
