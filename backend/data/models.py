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
    user_id = Column(String, ForeignKey('user.id'))
    created_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.now(), onupdate=func.now())
    layers = relationship("ModelLayer", order_by="ModelLayer.position",
                          collection_class=ordering_list('position'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'userId': self.user_id,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
            'layers': [layer.to_dict() for layer in self.layers]
        }


class ModelLayer(Base):
    """Represents a layer inside a model.

    A ModelLayer is identified by an auto-incrementing id. It also has a name that has to be unique for each model.
    """
    __tablename__ = 'model_layer'

    id = Column(Integer, primary_key=True)
    model_id = Column(Text, ForeignKey('model.id'))
    layer_id = Column(Text, ForeignKey('layer_type.id'))
    layer_name = Column(Text, nullable=False)
    position = Column(Integer, nullable=False)
    parameter_data = relationship("ModelLayerParameterData")
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

    model_layer_id = Column(Integer, ForeignKey("model_layer.id"), primary_key=True)
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
    parameters = relationship('LayerParameter')

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

    layer_type_id = Column(Text, ForeignKey('layer_type.id'), primary_key=True)
    name = Column(Text, nullable=False, primary_key=True,)
    type = Column(Text, nullable=False)
    default_value = Column(Text, nullable=False)

    def to_dict(self):
        return {
            'name': self.name,
            'type': self.type,
            'defaultValue': self.default_value
        }
