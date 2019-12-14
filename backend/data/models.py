from sqlalchemy import TIMESTAMP, Boolean, Column, ForeignKey, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
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
    __tablename__ = 'model'

    id = Column(Text, primary_key=True, nullable=False)
    name = Column(Text, nullable=False)
    user_id = Column(String, ForeignKey('user.id'))
    created_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'userId': self.user_id,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
