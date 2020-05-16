
import inspect
import sys

import torch.nn
import re

from neurodex.data.models import LayerType, LayerTypeParameter

from docutils.core import publish_parts
import docutils


def get_layers():
    pytorch_module = sys.modules[torch.nn.modules.__name__]
    list_of_modules = inspect.getmembers(pytorch_module, inspect.isclass)
    layer_types = []
    layer_type_parameters = []

    for name, cls in list_of_modules:
        if cls.__doc__:
            try:
                description = publish_parts(cls.__doc__, writer_name='html')['html_body']
            except docutils.utils.SystemMessage:
                description = cls.__doc__
        layer_type_id = "torch.nn." + name
        layer_type = LayerType(layer_type_id=layer_type_id, description=description, layer_name=name)
        parameters = get_parameters(layer_type_id, cls)
        layer_types.append(layer_type)
        layer_type_parameters.extend(parameters)

    return layer_types, layer_type_parameters


def get_parameters(layer_type_id, cls):
    doc_string = cls.__doc__
    if not doc_string:
        return []
    doc_string_parts = doc_string.split(u"\n")
    adding_parameters = False
    parameter_definition = []
    for line in doc_string_parts:
        if line.strip(" ") == "Args:":
            adding_parameters = True
            continue

        if adding_parameters:
            if not line.startswith("        "):
                adding_parameters = False
            else:
                x = line[8:]
                if x.startswith(u"    "):
                    parameter_definition[-1] = f'{parameter_definition[-1]} {x.strip(" ")}'
                else:
                    parameter_definition.append(line.strip(" "))

    result_parameters = []

    for parameter in parameter_definition:
        index_of_first_colon = parameter.find(":")
        definition = parameter[:index_of_first_colon]
        description = parameter[index_of_first_colon+2:]
        if description.startswith("Deprecated"):
            continue
        name = definition.split(" ")[0]
        required = True
        type = None
        if "(" in definition and ")" in definition:
            types = definition[definition.find("(")+1:definition.find(")")]
            types_parts = types.split(", ")
            type = types
            if len(types_parts) > 1:
                type = types_parts[0]
                required = types_parts[1] != 'optional'

        default = None

        if description.find("Default "):
            m = re.search(r"Default:? ([^\. ]+)", description)
            default = m.group(1) if m else None
            if default:
                if '`' in default:
                    default = default.replace('`', '')
                if '\'' in default:
                    default = default.replace('\'', '')
                if '"' in default:
                    default = default.replace('"', '')
                if ':math:' in default:
                    default = default.replace(':math:', '')

        layer_type_parameter = LayerTypeParameter(
            fk_layer_type_id=layer_type_id,
            name=name,
            description=description,
            type=type,
            default_value=default,
            required=required
        )

        result_parameters.append(layer_type_parameter)
    return result_parameters


get_parameters("", torch.nn.CTCLoss)
