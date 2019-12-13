from sqlalchemy import (TIMESTAMP, Column, ForeignKey, String, Text, Boolean)
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
        user_data = {}
        user_data['id'] = self.id
        user_data['username'] = self.username
        user_data['admin'] = self.admin
        return user_data


class Model(Base):
    __tablename__ = 'model'

    id = Column(Text, primary_key=True, nullable=False)
    name = Column(Text, nullable=False)
    owner = Column(String, ForeignKey('user.id'))
    created_at = Column(TIMESTAMP(timezone=False),
                        nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False,
                        server_default=func.now(), onupdate=func.now())

    def __init__(self, id, name, owner):
        self.id = id
        self.name = name,
        self.owner = owner,
        # self.created_at = func.now()
        # self.updated_at = func.now()
