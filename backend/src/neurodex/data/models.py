from sqlalchemy import (TIMESTAMP, Column, ForeignKey, Integer,
                        String, Table, Text, UniqueConstraint, Boolean)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

user_role_table = Table('user_role', Base.metadata,
                        Column('user_id', Text, ForeignKey('user.user_id')),
                        Column('role_id', Text, ForeignKey('role.role_id'))
                        )


class User(Base):
    """Represents a user object."""

    __tablename__ = "user"

    user_id = Column(Text, primary_key=True, nullable=False)
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    password = Column(Text, nullable=False)
    roles = relationship("Role", secondary=user_role_table, back_populates="users")
    user_metadata = relationship("UserMetadata", back_populates="user", uselist=False)


class UserMetadata(Base):

    __tablename__ = "user_metadata"

    fk_user_id = Column(String, ForeignKey('user.user_id', ondelete='CASCADE'), primary_key=True)
    confirmation_id = Column(Text, nullable=True)
    user = relationship("User", back_populates="user_metadata")


class Role(Base):

    __tablename__ = "role"

    role_id = Column(Text, primary_key=True, nullable=False)
    users = relationship("User", secondary=user_role_table, back_populates="roles")


class ActivatorTarget(Base):

    __tablename__ = "activator_target"

    activator_target_id = Column(Integer, nullable=False, primary_key=True)
    type = Column(String(50))

    __mapper_args__ = {
        'polymorphic_identity': 'name',
        'polymorphic_on': type
    }


class Model(Base):
    """Represents a model."""
    __tablename__ = 'model'

    model_id = Column(Text, primary_key=True, nullable=False)
    name = Column(Text, nullable=False)
    fk_user_id = Column(String, ForeignKey('user.user_id', ondelete='CASCADE'))
    created_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.now(), onupdate=func.now())

    layers = relationship("ModelLayer", order_by="ModelLayer.position",
                          collection_class=ordering_list('position'))
    activators = relationship("ModelActivator", order_by="ModelActivator.position",
                              collection_class=ordering_list('position'))

    user = relationship("User")

    def update_timestamp(self):
        self.updated_at = func.now()


class ModelLayer(ActivatorTarget):
    """Represents a layer inside a model.

    A ModelLayer is identified by an auto-incrementing id.
    It also has a name that has to be unique for each model.
    """
    __tablename__ = 'model_layer'

    model_layer_id = Column(Integer, ForeignKey(
        'activator_target.activator_target_id', ondelete='CASCADE'), primary_key=True)
    fk_model_id = Column(Text, ForeignKey('model.model_id', ondelete='CASCADE'))
    fk_layer_id = Column(Text, ForeignKey('layer_type.layer_type_id', ondelete='CASCADE'))
    name = Column(Text, nullable=False)
    position = Column(Integer, nullable=False)

    parameter_data = relationship("ModelLayerParameterData")
    model = relationship("Model", back_populates="layers")
    layer_type = relationship("LayerType")

    __mapper_args__ = {
        'polymorphic_identity': 'model_layer',
    }


class ModelLayerParameterData(Base):
    """Represents parameter data of a parameter in a layer."""
    __tablename__ = 'model_layer_parameter_data'

    fk_layer_type_parameter_id = Column(Integer, ForeignKey(
        "layer_type_parameter.layer_type_parameter_id", ondelete="CASCADE"), primary_key=True)
    fk_model_layer_id = Column(Integer, ForeignKey("model_layer.model_layer_id", ondelete='CASCADE'), primary_key=True)
    fk_value_id = Column(Integer, ForeignKey("value.value_id"))
    value = relationship('Value')

    __table_args__ = (UniqueConstraint('fk_model_layer_id', 'fk_layer_type_parameter_id',
                                       name='model_layer_parameter_name_uc'),)


class LayerType(Base):
    """Represents a type of layer."""
    __tablename__ = 'layer_type'

    layer_type_id = Column(Text, primary_key=True, nullable=False)
    description = Column(Text)
    layer_name = Column(Text, nullable=False)

    parameters = relationship('LayerTypeParameter', passive_deletes=True)


class LayerTypeParameter(Base):
    """Represents a parameter in a layer."""
    __tablename__ = 'layer_type_parameter'

    layer_type_parameter_id = Column(Integer, nullable=False, primary_key=True)
    fk_layer_type_id = Column(Text, ForeignKey('layer_type.layer_type_id', ondelete="CASCADE"))
    name = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(Text)
    default_value = Column(Text)
    required = Column(Boolean)


class Function(ActivatorTarget):
    __tablename__ = "function"

    function_id = Column(Integer, ForeignKey('activator_target.activator_target_id'), primary_key=True)
    name = Column(Text, nullable=False, unique=True)
    description = Column(Text)

    parameters = relationship("FunctionParameter", passive_deletes=True)

    __mapper_args__ = {
        'polymorphic_identity': 'function',
    }


class FunctionParameter(Base):
    __tablename__ = "function_parameter"

    function_parameter_id = Column(Integer, nullable=False, primary_key=True)
    fk_function_id = Column(Integer, ForeignKey('function.function_id', ondelete="CASCADE"))
    type = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    default_value = Column(Text, nullable=False)

    function = relationship("Function")

    __table_args__ = (UniqueConstraint('fk_function_id', 'name',
                                       name='function_parameter_name_uc'),)


class ModelActivator(Base):
    __tablename__ = "model_activator"

    model_activator_id = Column(Integer, primary_key=True)

    fk_model_id = Column(Text, ForeignKey('model.model_id', ondelete='CASCADE'))

    position = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)

    model = relationship("Model", back_populates="activators")

    __mapper_args__ = {
        'polymorphic_identity': 'name',
        'polymorphic_on': type
    }


class FunctionModelActivator(ModelActivator):
    __tablename__ = "function_model_activator"

    function_model_activator_id = Column(Integer, ForeignKey(
        'model_activator.model_activator_id'), primary_key=True)
    fk_function_id = Column(Integer, ForeignKey('function.function_id'), nullable=False)

    function = relationship("Function")
    parameter_data = relationship("FunctionModelActivatorParameterData")

    __mapper_args__ = {
        'polymorphic_identity': 'function_model_activator',
    }


class LayerModelActivator(ModelActivator):
    __tablename__ = "layer_model_activator"

    function_model_activator_id = Column(Integer, ForeignKey(
        'model_activator.model_activator_id'), primary_key=True)
    fk_model_layer_id = Column(Integer, ForeignKey('model_layer.model_layer_id'), nullable=False)

    model_layer = relationship("ModelLayer")

    __mapper_args__ = {
        'polymorphic_identity': 'layer_model_activator',
    }


class FunctionModelActivatorParameterData(Base):
    __tablename__ = "function_model_activator_parameter_data"

    function_model_activator_parameter_data_id = Column(Integer, nullable=False, primary_key=True)
    fk_function_model_activator_id = Column(Integer, ForeignKey(
        'function_model_activator.function_model_activator_id', ondelete='CASCADE'))
    fk_function_parameter_id = Column(Integer, ForeignKey(
        'function_parameter.function_parameter_id', ondelete='CASCADE'))

    function_model_activator = relationship("FunctionModelActivator", back_populates="parameter_data")

    fk_value_id = Column(Integer, ForeignKey("value.value_id"))
    value = relationship('Value')


class Value(Base):
    __tablename__ = 'value'

    value_id = Column(Integer, primary_key=True)
    name = Column(String(50))
    type = Column(String(50))

    __mapper_args__ = {
        'polymorphic_identity': 'value',
        'polymorphic_on': type
    }


class LayerValue(Value):
    __tablename__ = "layer_value"

    layer_value_id = Column(Integer, ForeignKey('value.value_id'), primary_key=True)
    fk_model_layer_id = Column(Integer, ForeignKey("model_layer.model_layer_id"))
    value = relationship("ModelLayer")

    __mapper_args__ = {
        'polymorphic_identity': 'layer_value',
    }


class PrimitiveValue(Value):
    __tablename__ = "primitive_value"

    primitive_value_id = Column(Integer, ForeignKey('value.value_id'), primary_key=True)
    value = Column(String)

    __mapper_args__ = {
        'polymorphic_identity': 'primitive_value',
    }
