import inspect
import sys

import torch.nn.functional
import torch.nn.modules

from backend import db
from backend.data.models import LayerType, LayerTypeParameter


def import_modules():
    pytorch_module = sys.modules[torch.nn.modules.__name__]
    list_of_modules = inspect.getmembers(pytorch_module, inspect.isclass)
    layer_types = []
    layer_type_parameters = []

    for name, cls in list_of_modules:
        layer_type = LayerType(id="torch.nn." + name, description="", layer_name=name)
        parameters = get_parameters(name, cls)
        layer_types.append(layer_type)
        layer_type_parameters.extend(parameters)

    db.session.bulk_save_objects(layer_types)
    db.session.bulk_save_objects(layer_type_parameters)
    db.session.commit()


def get_parameters(class_name, clazz):
    result = []
    sig = inspect.signature(clazz.__init__)
    for name, parameter in sig.parameters.items():
        if name == "self":
            continue
        default_value = None if parameter.default is inspect._empty else parameter.default
        parameter = LayerTypeParameter(layer_type_id="torch.nn." + class_name, name=name,
                                       type="number", default_value=default_value)
        result.append(parameter)

    return result
