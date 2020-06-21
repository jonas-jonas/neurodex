import os


class Config(object):
    DEBUG = False
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_ACCESS_COOKIE_PATH = '/api/'
    JWT_REFRESH_COOKIE_PATH = '/api/auth/refresh-token'
    # JWT_ACCESS_TOKEN_EXPIRES = 10
    JWT_COOKIE_CSRF_PROTECT = False

    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CACHE_TYPE = "redis"
    CACHE_KEY_PREFIX = "neurodex-cache"


class ProductionConfig(Config):
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    BASE_URL = "https://neurodex.app"


class DevelopmentConfig(Config):
    DEBUG = True
    JWT_SECRET_KEY = 'dev-key'
    BASE_URL = "http://localhost:8080"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 0
