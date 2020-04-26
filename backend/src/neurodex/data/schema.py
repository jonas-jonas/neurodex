from neurodex import ma

from .models import (Function, FunctionParameter, LayerType,
                     LayerTypeParameter, Model, ModelFunction,
                     ModelFunctionParameterData, ModelLayer,
                     ModelLayerParameterData, Role, User, Value)


def camelcase(s):
    if s.startswith("_"):
        parts = iter(s[1:].split('_'))
        return "_" + next(parts) + "".join(i.title() for i in parts)
    else:
        parts = iter(s.split("_"))
        return next(parts) + "".join(i.title() for i in parts)


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


class RoleSchema(CamelCaseSchema):
    class Meta:
        model = Role


class UserSchema(CamelCaseSchema):

    class Meta:
        model = User
        exclude = ('password',)

    roles = ma.Pluck(RoleSchema, 'id', many=True)


class LayerParameterSchema(CamelCaseSchema):
    class Meta:
        model = LayerTypeParameter


class LayerTypeSchema(CamelCaseSchema):
    class Meta:
        model = LayerType

    parameters = ma.List(ma.Nested(LayerParameterSchema))


class ActivationFunctionParameterSchema(CamelCaseSchema):
    class Meta:
        model = FunctionParameter


class ActivationFunctionSchema(CamelCaseSchema):
    class Meta:
        model = Function

    parameters = ma.List(ma.Nested(ActivationFunctionParameterSchema))


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


class LayerValueSchema(CamelCaseSchema):
    class Meta:
        fields = ('id', 'layer_name')


class ModelFunctionParameterDataSchema(CamelCaseSchema):
    class Meta:
        model = ModelFunctionParameterData

    value = ma.Nested(ValueSchema)


class ModelFunctionSchema(CamelCaseSchema):
    class Meta:
        model = ModelFunction

    function = ma.Nested(ActivationFunctionSchema)
    parameter_data = ParameterData(ModelFunctionParameterDataSchema, key="parameterName", value="value")


class ModelLayerParameterDataSchema(CamelCaseSchema):
    class Meta:
        model = ModelLayerParameterData

    value = ma.Nested(ValueSchema)


class ModelLayerSchema(CamelCaseSchema):
    class Meta:
        model = ModelLayer

    layer_type = ma.Nested(LayerTypeSchema)
    parameter_data = ParameterData(ModelLayerParameterDataSchema, key="parameterName", value="value")


class ModelSchema(CamelCaseSchema):
    class Meta:
        model = Model

    user = ma.Nested(UserSchema)
    functions = ma.List(ma.Nested(ModelFunctionSchema))
    layers = ma.List(ma.Nested(ModelLayerSchema))


user_schema = UserSchema()
users_schema = UserSchema(many=True)

model_schema = ModelSchema()
models_schema = ModelSchema(many=True)

model_layer_schema = ModelLayerSchema()
model_layers_schema = ModelLayerSchema(many=True)

model_function_schema = ModelFunctionSchema()
model_functions_schema = ModelFunctionSchema(many=True)

layer_type_schema = LayerTypeSchema()
layer_types_schema = LayerTypeSchema(many=True)

layer_parameter_schema = LayerParameterSchema()
layer_parameters_schema = LayerParameterSchema(many=True)

activation_function_schema = ActivationFunctionSchema()
activation_functions_schema = ActivationFunctionSchema(many=True)

activation_function_parameter_schema = ActivationFunctionParameterSchema()
activation_function_parameters_schema = ActivationFunctionParameterSchema(many=True)

layer_value_schema = LayerValueSchema()
