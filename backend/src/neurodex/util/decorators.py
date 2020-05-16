from functools import wraps

from flask import abort
from flask_jwt_extended import current_user


def own_model(fn):
    @wraps(fn)
    def wrapped_function(*args, **kwargs):
        model = kwargs['model']
        if model is None or model.fk_user_id != current_user.user_id:
            abort(404)

        return fn(*args, **kwargs)

    return wrapped_function


def needs_role(role):
    def needs_role(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if role.upper() not in list(map(lambda role: role.role_id.upper(), current_user.roles)):
                abort(403)

            return fn(*args, **kwargs)
        return decorator
    return needs_role
