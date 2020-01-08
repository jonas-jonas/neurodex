from sqlalchemy import (TIMESTAMP, Boolean, Column, ForeignKey, Integer,
                        String, Text, UniqueConstraint)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    """Represents a user object."""

    __tablename__ = "user"

    id = Column(Text, primary_key=True, nullable=False)
    username = Column(Text, nullable=False)
    password = Column(Text, nullable=False)
    admin = Column(Boolean, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'admin': self.admin
        }


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

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'userId': self.user_id,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
            'layers': [layer.to_dict() for layer in self.layers],
            'functions': [function.to_dict() for function in self.functions],
        }


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

    def to_dict(self):
        return {
            'id': self.id,
            'layerType': self.layer_type.to_dict(),
            'layerName': self.layer_name,
            'parameterData': {data.parameter_name: data.value for data in self.parameter_data}
        }


class ModelLayerParameterData(Base):
    """Represents parameter data of a parameter in a layer."""
    __tablename__ = 'model_layer_parameter_data'

    model_layer_id = Column(Integer, ForeignKey("model_layer.id", ondelete='CASCADE'), primary_key=True)
    parameter_name = Column(Text, nullable=False, primary_key=True)
    value = Column(Text, nullable=False)

    __table_args__ = (UniqueConstraint('model_layer_id', 'parameter_name', name='model_layer_parameter_name_uc'),)

    def to_dict(self):
        return {
            self.parameter_name: self.value,
        }


class LayerType(Base):
    """Represents a type of layer."""
    __tablename__ = 'layer_type'

    id = Column(Text, primary_key=True, nullable=False)
    description = Column(Text)
    layer_name = Column(Text)
    parameters = relationship('LayerParameter', passive_deletes=True)

    def to_dict(self):
        return {
            'id': self.id,
            'layerName': self.layer_name,
            'description': self.description,
            'parameters': [parameter.to_dict() for parameter in self.parameters]
        }


class LayerParameter(Base):
    """Represents a parameter in a layer."""
    __tablename__ = 'layer_parameter'

    layer_type_id = Column(Text, ForeignKey('layer_type.id', ondelete="CASCADE"), primary_key=True)
    name = Column(Text, nullable=False, primary_key=True,)
    type = Column(Text, nullable=False)
    default_value = Column(Text, nullable=False)

    def to_dict(self):
        return {
            'name': self.name,
            'type': self.type,
            'defaultValue': self.default_value
        }


class ActivationFunction(Base):
    __tablename__ = "activation_function"

    id = Column(Integer, nullable=False, primary_key=True)
    name = Column(Text, nullable=False, unique=True)
    description = Column(Text)
    parameters = relationship("ActivationFunctionParameter", passive_deletes=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'parameters': [param.to_dict() for param in self.parameters]
        }


class ActivationFunctionParameter(Base):
    __tablename__ = "activation_function_parameter"

    id = Column(Integer, nullable=False, primary_key=True)
    activation_function_id = Column(Integer, ForeignKey('activation_function.id', ondelete="CASCADE"))
    type = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    default_value = Column(Text, nullable=False)

    def to_dict(self):
        return {
            'type': self.type,
            'name': self.name,
            'defaultValue': self.default_value
        }


class ModelFunction(Base):
    __tablename__ = "model_function"

    id = Column(Integer, primary_key=True)
    model_id = Column(Text, ForeignKey('model.id', ondelete='CASCADE'))
    activation_function_id = Column(Integer, ForeignKey('activation_function.id', ondelete='CASCADE'))
    position = Column(Integer, nullable=False)
    parameter_data = relationship("ModelFunctionParameterData", passive_deletes=True)
    model = relationship("Model", back_populates="functions")
    function = relationship("ActivationFunction")

    def to_dict(self):
        return {
            'id': self.id,
            'function': self.function.to_dict(),
            'parameterData': {data.parameter_name: data.value for data in self.parameter_data}
        }


class ModelFunctionParameterData(Base):
    __tablename__ = "model_function_parameter_Data"

    model_function_id = Column(Integer, ForeignKey("model_function.id", ondelete='CASCADE'), primary_key=True)
    parameter_name = Column(Text, nullable=False, primary_key=True)
    value = Column(Text, nullable=False)
