from backend import ma

from .models import (ActivationFunction, ActivationFunctionParameter,
                     LayerParameter, LayerType, Model, Role, User)


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

    _links = ma.Hyperlinks(
        {
            "self": ma.URLFor("user.get_user", id="<id>"),
            "collection": ma.URLFor("user.get_users")
        }
    )


class ModelSchema(CamelCaseSchema):
    class Meta:
        model = Model

    user = ma.Nested(UserSchema)

    _links = ma.Hyperlinks(
        {
            "self": ma.URLFor("model.get_model", id="<id>"),
            "collection": ma.URLFor("model.get_models"),
            "layers": ma.URLFor('model.get_model_layers', id="<id>"),
            "functions": ma.URLFor('model.get_model_functions', id="<id>"),
            "user": ma.URLFor('user.get_user', id="<user_id>")
        }
    )


class ModelLayerSchema(ma.Schema):
    class Meta:
        fields = ("id",)


class ModelFunctionSchema(ma.Schema):
    class Meta:
        fields = ("id",)


class LayerParameterSchema(CamelCaseSchema):
    class Meta:
        model = LayerParameter


class LayerTypeSchema(CamelCaseSchema):
    class Meta:
        model = LayerType

    parameters = ma.List(ma.Nested(LayerParameterSchema))


class ActivationFunctionParameterSchema(CamelCaseSchema):
    class Meta:
        model = ActivationFunctionParameter


class ActivationFunctionSchema(CamelCaseSchema):
    class Meta:
        model = ActivationFunction

    parameters = ma.List(ma.Nested(ActivationFunctionParameterSchema))


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
