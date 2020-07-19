
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from neurodex.data.models import (Function, FunctionModelActivator,
                                  FunctionModelActivatorParameterData,
                                  FunctionParameter, LayerModelActivator,
                                  LayerType, LayerTypeParameter, LayerValue,
                                  Model, ModelLayer, ModelLayerParameterData,
                                  PrimitiveValue, Role, User)


def _get_module_path(schema_class_name: str) -> str:
    return f"neurodex.graphql.schema.{schema_class_name}"


class RoleSchema(SQLAlchemyObjectType):
    class Meta:
        model = Role


class UserSchema(SQLAlchemyObjectType):
    class Meta:
        model = User
        exclude_fields = ("password", )

    roles = graphene.List(_get_module_path("RoleSchema"))


class ModelSchema(SQLAlchemyObjectType):
    class Meta:
        model = Model
        exclude_fields = ("fk_user_id", )

    user = graphene.Field(UserSchema)
    activators = graphene.List(_get_module_path("ModelActivatorSchema"))

    def resolve_activators(self, info):
        return [model_activator.activator_target for model_activator in self.activators]


class LayerTypeSchema(SQLAlchemyObjectType):
    class Meta:
        model = LayerType

    parameters = graphene.List(_get_module_path("LayerParameterSchema"))


class FunctionSchema(SQLAlchemyObjectType):
    class Meta:
        model = Function

    parameters = graphene.List(_get_module_path("FunctionParameterSchema"))


class FunctionParameterSchema(SQLAlchemyObjectType):
    class Meta:
        model = FunctionParameter


class LayerParameterSchema(SQLAlchemyObjectType):
    class Meta:
        model = LayerTypeParameter


class LayerModelActivatorSchema(SQLAlchemyObjectType):
    class Meta:
        model = LayerModelActivator
        # exclude_fields = ("activator_target_id", "type", "fk_model_id", "fk_layer_id", "parameter_data")


class FunctionModelActivatorSchema(SQLAlchemyObjectType):
    class Meta:
        model = FunctionModelActivator
        # exclude_fields = ("activator_target_id", )

    activator_parameters = graphene.List(_get_module_path("FunctionModelActivatorParameterSchema"))

    def resolve_activator_parameters(self, info):
        return self.parameters


class FunctionModelActivatorParameterSchema(SQLAlchemyObjectType):
    class Meta:
        model = FunctionModelActivatorParameterData
        exclude_fields = ("fk_function_id",)

    parameter_value = graphene.Field(_get_module_path("ValueSchema"))

    def resolve_parameter_value(self, info):
        return {}


class ModelActivatorSchema(graphene.Union):
    class Meta:
        types = (FunctionModelActivatorSchema, LayerModelActivatorSchema)


class ModelLayerSchema(SQLAlchemyObjectType):
    class Meta:
        model = ModelLayer
        exclude_fields = ("activator_target_id", "type", "fk_model_id", "fk_layer_id", "parameter_data")

    parameters = graphene.List(_get_module_path("ModelLayerParameterSchema"))

    def resolve_parameters(self, info):
        return self.layer_type.parameters


class ModelLayerParameterSchema(SQLAlchemyObjectType):
    class Meta:
        model = LayerTypeParameter
        exclude_fields = ("layer_type_parameter_id", "fk_layer_type_id", )
        description = "A parameter definition including its set data, if set"

    parameter_id = graphene.Int(description="The id of the parameter")
    parameter_value = graphene.Field(_get_module_path("ValueSchema"))

    def resolve_parameter_id(self, info):
        return self.layer_type_parameter_id

    def resolve_parameter_value(self, info):
        parameter_id = self.layer_type_parameter_id
        query = ModelLayerParameterDataSchema.get_query(info)
        result = query.filter(ModelLayerParameterData.fk_layer_type_parameter_id == parameter_id).first()
        if result is None:
            return None
        else:
            return result.value


class ModelLayerParameterDataSchema(SQLAlchemyObjectType):
    class Meta:
        model = ModelLayerParameterData

    key = graphene.String()
    parameter_value = graphene.Field(_get_module_path("ValueSchema"))

    def resolve_key(self, info):
        return self.parameter_name

    def resolve_parameter_value(self, info):
        return self.value


class ModelActivatorTargetSchema(graphene.Union):
    class Meta:
        types = (ModelLayerSchema, FunctionSchema)


class LayerValueSchema(SQLAlchemyObjectType):
    class Meta:
        model = LayerValue


class PrimitiveValueSchema(SQLAlchemyObjectType):
    class Meta:
        model = PrimitiveValue
        exclude_fields = ("primitive_value_id", "value_id", "name")


class ValueSchema(graphene.Union):
    class Meta:
        types = (PrimitiveValueSchema, LayerValueSchema)


class Query(graphene.ObjectType):
    all_users = graphene.List(UserSchema)
    all_models = graphene.List(ModelSchema, user_id=graphene.String(required=True))
    all_layer_types = graphene.List(LayerTypeSchema)
    all_functions = graphene.List(FunctionSchema)

    def resolve_all_users(self, info):
        query = UserSchema.get_query(info)
        return query.all()

    def resolve_all_models(self, info, user_id):
        query = ModelSchema.get_query(info)
        return query.filter(Model.fk_user_id == user_id).all()

    def resolve_all_layer_types(self, info):
        query = LayerTypeSchema.get_query(info)
        return query.all()

    def resolve_all_functions(self, info):
        query = FunctionSchema.get_query(info)
        return query.all()
