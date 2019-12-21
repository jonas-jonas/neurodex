from flask import jsonify


def page_not_found(e):
    errors = {
        'code': 404,
        'title': 'The requested page was not found',
        'message': e.description,
    }

    return jsonify(errors), 404


def internal_error(e):
    errors = {
        'code': 500,
        'title': 'An internal error occured',
        'message': e.description
    }

    return jsonify(errors), 500
