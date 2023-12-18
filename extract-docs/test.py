import inspect
import json

import bamboost
import black
from docstring_parser import parse


def handle_type(type):
    if type is inspect._empty:
        return None
    else:
        return str(type)


def parse_signature(name: str, obj: object):
    docstring = inspect.getdoc(obj)

    # Extract parameters and returns from docstring using regex
    if docstring:
        doc = parse(docstring)
        docstring = {
            "description": f"{doc.short_description} {doc.long_description or ''}".replace(
                "\n", " "
            ),
            "arguments": {
                param.arg_name.split()[0]: param.description for param in doc.params
            },
            "return": doc.returns.description if doc.returns else None,
        }
    else:
        docstring = {}

    # Extract type hints from function signature
    signature = inspect.signature(obj)
    description_return = docstring.get("return", None)
    if description_return:
        description_return = description_return.replace("\n", " ")
    try:
        signature_str = black.format_str(f"""def {name}{signature}: ...""", mode=black.FileMode()).strip()
    except:
        signature_str = f"def {name}{signature}: ..."

    res = {
        "signature": signature_str,
        "description": docstring.get("description", None),
        "arguments": [],
        "return": {
            "type": handle_type(signature.return_annotation),
            "description": description_return,
        },
    }
    for param in signature.parameters:
        description_arg = docstring.get("arguments", {}).get(param, None)
        if description_arg:
            description_arg = description_arg.replace("\n", " ")

        res["arguments"].append(
            {
                "name": param,
                "type": handle_type(signature.parameters[param].annotation),
                "default": handle_type(signature.parameters[param].default),
                "description": description_arg,
            }
        )

    return res


def extract_methods(class_name):
    functions = inspect.getmembers(class_name, inspect.isfunction)
    result = {}

    for name, obj in functions:
        if name.startswith("_"):
            continue
        result[name] = parse_signature(name, obj)

    return result


def extract_classes(module):
    classes = inspect.getmembers(module, inspect.isclass)
    result = {}

    for name, obj in classes:
        if (
            hasattr(module, "__all__") and name not in module.__all__
        ):  # Only extract public modules
            continue

        if name.startswith("_"):
            continue
        print("Extracting class", name, flush=True)
        result[name] = {
            "description": inspect.getdoc(obj),
            "methods": extract_methods(obj),
        }

    return result


def extract_modules(module):
    modules = inspect.getmembers(module, inspect.ismodule)
    result = {}

    for name, obj in modules:
        if name.startswith("_"):
            continue
        if (
            hasattr(module, "__all__") and name not in module.__all__
        ):  # Only extract public modules
            continue

        if name in {
            "os",
            "sys",
            "numpy",
            "pandas",
            "mpi4py",
            "h5py",
            "matplotlib",
            "logging",
            "json",
            "subprocess",
        }:
            continue
        print("Extracting module", name, flush=True)
        result[name] = {
            "description": inspect.getdoc(obj),
            "classes": extract_classes(obj),
            "methods": extract_methods(obj),
            "modules": extract_modules(obj),
        }

    return result





if __name__ == "__main__":
    with open("../static/bamboost-api-doc.json", "w") as f:
        f.write(json.dumps(extract_modules(bamboost), indent=2))
