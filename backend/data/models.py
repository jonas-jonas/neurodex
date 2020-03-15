from sqlalchemy import (TIMESTAMP, Column, ForeignKey, Integer,
                        String, Table, Text, UniqueConstraint)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

user_role_table = Table('user_role', Base.metadata,
                        Column('user_id', Text, ForeignKey('user.id')),
                        Column('role_id', Text, ForeignKey('role.id'))
                        )


class User(Base):
    """Represents a user object."""

    __tablename__ = "user"

    id = Column(Text, primary_key=True, nullable=False)
    email = Column(Text, nullable=False)
    password = Column(Text, nullable=False)
    roles = relationship("Role", secondary=user_role_table, back_populates="users")


class Role(Base):

    __tablename__ = "role"

    id = Column(Text, primary_key=True, nullable=False)
    users = relationship("User", secondary=user_role_table, back_populates="roles")


class Model(Base):
    """Represents a model."""
    __tablename__ = 'model'

    id = Column(Text, primary_key=True, nullable=False)
    name = Column(Text, nullable=False)
    user_id = Column(String, ForeignKey('user.id', ondelete='CASCADE'))
    created_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.now(), onupdate=func.now())
    layers = relationship("ModelLayer", order_by="ModelLayer.position",
                          collection_class=ordering_list('position'))
    functions = relationship("ModelFunction", order_by="ModelFunction.position",
                             collection_class=ordering_list('position'))

    def update_timestamp(self):
        self.updated_at = func.now()


class ModelLayer(Base):
    """Represents a layer inside a model.

    A ModelLayer is identified by an auto-incrementing id. It also has a name that has to be unique for each model.
    """
    __tablename__ = 'model_layer'

    id = Column(Integer, primary_key=True)
    model_id = Column(Text, ForeignKey('model.id', ondelete='CASCADE'))
    layer_id = Column(Text, ForeignKey('layer_type.id', ondelete='CASCADE'))
    layer_name = Column(Text, nullable=False)
    position = Column(Integer, nullable=False)
    parameter_data = relationship("ModelLayerParameterData", passive_deletes=True)
    model = relationship("Model", back_populates="layers")
    layer_type = relationship("LayerType")

    __table_args__ = (UniqueConstraint('model_id', 'layer_name', name='model_layer_name_uc'),)


class ModelLayerParameterData(Base):
    """Represents parameter data of a parameter in a layer."""
    __tablename__ = 'model_layer_parameter_data'

    model_layer_id = Column(Integer, ForeignKey("model_layer.id", ondelete='CASCADE'), primary_key=True)
    parameter_name = Column(Text, nullable=False, primary_key=True)
    value_id = Column(Integer, ForeignKey("value.id"))
    value = relationship('Value')

    __table_args__ = (UniqueConstraint('model_layer_id', 'parameter_name', name='model_layer_parameter_name_uc'),)


class LayerType(Base):
    """Represents a type of layer."""
    __tablename__ = 'layer_type'

    id = Column(Text, primary_key=True, nullable=False)
    description = Column(Text)
    layer_name = Column(Text, nullable=False)
    parameters = relationship('LayerTypeParameter', passive_deletes=True)


class LayerTypeParameter(Base):
    """Represents a parameter in a layer."""
    __tablename__ = 'layer_type_parameter'

    layer_type_id = Column(Text, ForeignKey('layer_type.id', ondelete="CASCADE"), primary_key=True)
    name = Column(Text, nullable=False, primary_key=True,)
    type = Column(Text, nullable=False)
    default_value = Column(Text, nullable=False)


class Function(Base):
    __tablename__ = "function"

    id = Column(Integer, nullable=False, primary_key=True)
    name = Column(Text, nullable=False, unique=True)
    description = Column(Text)
    parameters = relationship("FunctionParameter", passive_deletes=True)


class FunctionParameter(Base):
    __tablename__ = "function_parameter"

    id = Column(Integer, nullable=False, primary_key=True)
    function_id = Column(Integer, ForeignKey('function.id', ondelete="CASCADE"))
    type = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    default_value = Column(Text, nullable=False)


class ModelFunction(Base):
    __tablename__ = "model_function"

    id = Column(Integer, primary_key=True)
    model_id = Column(Text, ForeignKey('model.id', ondelete='CASCADE'))
    function_id = Column(Integer, ForeignKey('function.id', ondelete='CASCADE'))
    position = Column(Integer, nullable=False)
    parameter_data = relationship("ModelFunctionParameterData", passive_deletes=True)
    model = relationship("Model", back_populates="functions")
    function = relationship("Function")


class ModelFunctionParameterData(Base):
    __tablename__ = "model_function_parameter_data"

    model_function_id = Column(Integer, ForeignKey("model_function.id", ondelete='CASCADE'), primary_key=True)
    parameter_name = Column(Text, nullable=False, primary_key=True)
    value_id = Column(Integer, ForeignKey("value.id"))
    value = relationship('Value')

    __table_args__ = (UniqueConstraint('model_function_id', 'parameter_name', name='model_function_parameter_name_uc'),)


class Value(Base):
    __tablename__ = 'value'

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    type = Column(String(50))
    value = None

    __mapper_args__ = {
        'polymorphic_identity': 'value',
        'polymorphic_on': type
    }


class LayerValue(Value):
    __tablename__ = "layer_value"

    id = Column(Integer, ForeignKey('value.id'), primary_key=True)
    value_id = Column(Integer, ForeignKey("model_layer.id"))
    value = relationship("ModelLayer")

    __mapper_args__ = {
        'polymorphic_identity': 'layer_value',
    }


class PrimitiveValue(Value):
    __tablename__ = "primitive_value"

    id = Column(Integer, ForeignKey('value.id'), primary_key=True)
    value = Column(String)

    __mapper_args__ = {
        'polymorphic_identity': 'primitive_value',
    }
