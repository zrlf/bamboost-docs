import inspect
from textwrap import dedent
from typing import Any, Dict

import pdoc
from docstring_parser import DocstringParam

from .models import ApiClass, ApiMethod, ApiModule, ApiVariable
from .parsers import parse_docstring
from .utils import extract_signature, sanitize_annotation

INCLUDE_METHODS = {
    "__getitem__",
    "__setitem__",
    "__len__",
    "__iter__",
}


def document_method(
    method: pdoc.doc.Function, is_classmethod: bool = False
) -> ApiMethod:
    """
    Document a method and return its documentation as a dictionary.

    Args:
        method (pdoc.doc.Function): The method to document.
        is_classmethod (bool): Whether the method is a class method.

    Returns:
        ApiMethod: The method's documentation.
    """
    docstring = parse_docstring(method.docstring or "")
    signature = method.signature
    source_code = dedent(method.source)

    method_data = {
        "name": method.name,
        "docstring": docstring["description"],
        "signature": extract_signature(source_code) or str(signature),
        "returns": {
            "annotation": sanitize_annotation(signature.return_annotation),
            "description": docstring["returns"].replace("\n", " ")
            if docstring["returns"]
            else None,
        },
        "arguments": {
            key: {
                "default": str(param.default)
                if param.default != inspect._empty
                else None,
                "annotation": sanitize_annotation(param.annotation),
                "description": docstring["arguments"].get(key),
            }
            for key, param in signature.parameters.items()
        },
        "source": {
            "code": source_code,
            "lines": method.source_lines,
        },
        "props": {
            "isClassMethod": is_classmethod,
        },
        "examples": docstring["examples"],
    }

    return method_data


def document_instance_variable(
    variable: pdoc.doc.Variable,
    param_from_module_docstring: DocstringParam | None = None,
) -> ApiVariable:
    """
    Document an instance variable.

    Args:
        variable (pdoc.doc.Variable): The variable to document.
        module_attributes (Dict[str, Any], optional): Module attributes for additional context.

    Returns:
        ApiVariable: The variable's documentation.
    """
    if variable.docstring:
        description = parse_docstring(variable.docstring)["description"]
    elif param_from_module_docstring:
        description = param_from_module_docstring.description
    else:
        description = None

    return {
        "name": variable.name,
        "annotation": sanitize_annotation(variable.annotation),
        "description": description,
        "default": variable.default_value_str,
    }


def document_class(cls: pdoc.doc.Class) -> ApiClass:
    """
    Document a class and return its documentation as a dictionary.

    Args:
        cls (pdoc.doc.Class): The class to document.

    Returns:
        ApiClass: The class's documentation.
    """
    own_members = cls.own_members
    classmethods = {method.name for method in cls.classmethods}
    class_docstring = parse_docstring(cls.docstring or "")

    result = {
        "name": cls.name,
        "short_description": class_docstring["short_description"],
        "docstring": class_docstring["description"],
        "methods": {},
        "properties": [],
        "inherits_from": {
            f"{module}.{name}": {
                "module": module,
                "members": [
                    (member.type, member.name)
                    for member in cls.inherited_members[(module, name)]
                    if not member.name.startswith("_") or member.name in INCLUDE_METHODS
                ],
            }
            for module, name in cls.inherited_members
            if module != "builtins"
        },
        "examples": class_docstring["examples"],
        "constructor": {},
    }

    # Document the constructor (__init__)
    constructor = cls.members.get("__init__")
    if constructor and isinstance(constructor, pdoc.doc.Function):
        constructor_docstring = parse_docstring(constructor.docstring or "")
        result["constructor"] = {
            "signature": extract_signature(dedent(constructor.source)),
            "arguments": {
                key: {
                    "default": str(param.default)
                    if param.default != inspect._empty
                    else None,
                    "annotation": sanitize_annotation(param.annotation),
                    "description": constructor_docstring["arguments"].get(key),
                }
                for key, param in constructor.signature.parameters.items()
            },
            "source": {
                "code": dedent(constructor.source),
                "lines": constructor.source_lines,
            },
        }

    # Document methods and properties
    for member in own_members:
        if member.name.startswith("_") and member.name not in INCLUDE_METHODS:
            continue
        if isinstance(member, pdoc.doc.Function):
            result["methods"][member.name] = document_method(
                member, is_classmethod=member.name in classmethods
            )
        elif isinstance(member, pdoc.doc.Variable):
            result["properties"].append(document_instance_variable(member))

    return result


def document_module(module: pdoc.doc.Module) -> ApiModule:
    """
    Document a module and return its documentation as a dictionary.

    Args:
        module (pdoc.doc.Module): The module to document.

    Returns:
        ApiModule: The module's documentation.
    """
    parsed_docstring = parse_docstring(module.docstring or "")
    slug = module.fullname.split(".")

    result = {
        "name": module.name,
        "slug": slug,
        "docstring": parsed_docstring["description"].strip(),
        "short_description": parsed_docstring["description"].split("\n\n")[0],
        "attributes": [
            document_instance_variable(
                variable,
                param_from_module_docstring=parsed_docstring["params"].get(
                    variable.name, None
                ),
            )
            for variable in module.variables
        ],
        "classes": [document_class(cls) for cls in module.classes],
        "functions": [
            document_method(func)
            for func in module.functions
            if not func.name.startswith("_")
        ],
        "submodules": [document_module(sub_module) for sub_module in module.submodules],
        "examples": parsed_docstring["examples"],
        "version": None,
    }

    return result
