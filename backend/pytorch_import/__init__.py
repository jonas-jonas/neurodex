import inspect
import sys

import torch.nn.functional as F
import torch.nn.modules


def import_functions():
    F._adaptive_max_pool1d
    pytorch_f_module = sys.modules[torch.nn.functional.__name__]
    pytorch_functions = inspect.getmembers(pytorch_f_module, inspect.isfunction)
    for x, y in pytorch_functions:
        print(x)
        print(inspect.signature(y))
        break;


import_functions()
