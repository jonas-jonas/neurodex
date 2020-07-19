from neurodex import ma
from neurodex.util import camelcase

from .models import (Function, FunctionParameter, LayerType,
                     LayerTypeParameter, Model, ModelActivator, ModelLayer,
                     ModelLayerParameterData, Role, User, Value)


class CamelCaseSchema(ma.SQLAlchemyAutoSchema):
    """Schema that uses camel-case for its external representation
    and snake-case for its internal representation.
    """

    def on_bind_field(self, field_name, field_obj):
        field_obj.data_key = camelcase(field_obj.data_key or field_name)


class ParameterData(ma.Nested):
    def __init__(self, nested, key, value, *args, **kwargs):
        super(ParameterData, self).__init__(nested, many=True, *args, **kwargs)
        self.key = key
        self.value = value

    def _serialize(self, nested_obj, attr, obj):
        nested_list = super(ParameterData, self)._serialize(nested_obj, attr, obj)
        nested_dict = {item[self.key]: item[self.value]['value'] for item in nested_list if item}
        return nested_dict

# =================================================================
# Schema Definitions
# =================================================================


class UserSchema(CamelCaseSchema):

    class Meta:
        model = User
        exclude = ('password',)

    roles = ma.Pluck("RoleSchema", 'role_id', many=True)


class RoleSchema(CamelCaseSchema):
    class Meta:
        model = Role


class ModelSchema(CamelCaseSchema):
    class Meta:
        model = Model

    user = ma.Nested("UserSchema")
    activators = ma.List(ma.Nested("ModelActivatorSchema"))
    layers = ma.List(ma.Nested("ModelLayerSchema"))


class LayerTypeSchema(CamelCaseSchema):
    class Meta:
        model = LayerType

    parameters = ma.List(ma.Nested("LayerParameterSchema"))


class LayerParameterSchema(CamelCaseSchema):
    class Meta:
        model = LayerTypeParameter


class FunctionParameterSchema(CamelCaseSchema):
    class Meta:
        model = FunctionParameter


class FunctionSchema(CamelCaseSchema):
    class Meta:
        model = Function

    display_name = ma.String(attribute="name", dump_only=True)
    parameters = ma.List(ma.Nested("FunctionParameterSchema"))


class ValueSchema(CamelCaseSchema):
    class Meta:
        model = Value
        exclude = ("type",)

    value = ma.Method("serialize_value")

    def serialize_value(self, obj):
        value = obj.value
        if isinstance(value, ModelLayer):
            return {'value': value.layer_name, 'id': value.id}
        else:
            return {'value': value}


class ModelLayerSchema(CamelCaseSchema):
    class Meta:
        model = ModelLayer

    display_name = ma.Method("_display_name")

    layer_type = ma.Nested("LayerTypeSchema")
    parameter_data = ParameterData("ParamaterDataSchema", key="fkLayerTypeParameterId", value="value")

    def _display_name(self, model_layer):
        id = model_layer.model_layer_id
        name = model_layer.name
        return f"{name}{id}"


class ParamaterDataSchema(CamelCaseSchema):
    class Meta:
        model = ModelLayerParameterData

    value = ma.Nested("ValueSchema")


class ModelActivatorSchema(CamelCaseSchema):
    class Meta:
        model = ModelActivator

    value = ma.Method('serialize_value')
    parameter_data = ParameterData("ParamaterDataSchema", key="parameterName", value="value")

    def serialize_value(self, obj):
        value = obj.activator_target
        if isinstance(value, ModelLayer):
            return model_layer_schema.dump(value)
        elif isinstance(value, Function):
            return activation_function_schema.dump(value)


user_schema = UserSchema()
users_schema = UserSchema(many=True)

model_schema = ModelSchema()
models_schema = ModelSchema(many=True)

model_layer_schema = ModelLayerSchema()
model_layers_schema = ModelLayerSchema(many=True)

layer_type_schema = LayerTypeSchema()
layer_types_schema = LayerTypeSchema(many=True)

layer_parameter_schema = LayerParameterSchema()
layer_parameters_schema = LayerParameterSchema(many=True)

activation_function_schema = FunctionSchema()
activation_functions_schema = FunctionSchema(many=True)

activation_function_parameter_schema = FunctionParameterSchema()
activation_function_parameters_schema = FunctionParameterSchema(many=True)
