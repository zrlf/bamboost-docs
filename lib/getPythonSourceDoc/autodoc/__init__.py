"""
Extract source documentation from bamboost package and store it in a JSON file.

Classes:
    AutoDoc

Functions:
    parse_docstring, document_method, document_instance_variable,
    document_class, document_module
"""

from __future__ import annotations

import inspect
import json
import re
from types import ModuleType
from typing import TypedDict

import pdoc
from docstring_parser import parse

INCLUDE_METHODS = {
    "__getitem__",
    "__setitem__",
    "__len__",
    "__iter__",
}


class apiModule(TypedDict):
    name: str
    docstring: str
    classes: list[apiClass]
    functions: list[apiMethod]
    submodules: list[apiModule]


class apiClass(TypedDict):
    name: str
    short_description: str
    docstring: str
    methods: dict[str, apiMethod]
    properties: dict[str, apiVariable]
    inherits_from: dict[str, dict[str, list[tuple[str, str]]]]
    examples: list[str]


class apiMethod(TypedDict):
    name: str
    docstring: str
    signature: str
    returns: dict[str, str]
    arguments: dict[str, apiParameter]
    source: dict[str, str]
    props: dict[str, bool]
    examples: list[str]


class apiVariable(TypedDict):
    name: str
    annotation: str
    description: str


class apiParameter(TypedDict):
    description: str
    default: str
    annotation: str


class apiReturn(TypedDict):
    description: str
    annotation: str

class parsedDocstring(TypedDict):
    short_description: str
    description: str
    arguments: dict[str, str]
    returns: str  # Changed from 'return' to 'returns'
    examples: list[str]

def parse_docstring(docstring: str) -> parsedDocstring:
    """Parse docstring and return description, arguments and return."""
    doc = parse(docstring)

    # split examples on empty lines
    examples_str = (
        doc.examples[0].description if doc.examples and doc.examples[0] else None
    )
    examples = re.split(r"\n\s*\n", examples_str.strip()) if examples_str else []

    return {
        "short_description": doc.short_description if doc.short_description else "",
        "description": doc.description if doc.description else "",
        "arguments": {
            param.arg_name.split()[0]: param.description for param in doc.params
        },
        "returns": doc.returns.description if doc.returns else None,
        "examples": examples,
    }


def document_method(method: pdoc.doc.Function, is_classmethod=False) -> apiMethod:
    """Document method and return dictionary with documentation."""
    docstring = parse_docstring(method.docstring)
    signature = method.signature

    method_data = {
        "name": method.name,
        "docstring": docstring["description"],
        "signature": signature.__str__(),
        "returns": {
            "annotation": sanitize_annotation(str(signature.return_annotation)),
            "description": (
                docstring["returns"].replace("\n", " ") if docstring["returns"] else None
            ),
        },
        "arguments": {
            key: {
                "default": str(val.default) if val.default != inspect._empty else None,
                "annotation": sanitize_annotation(str(val.annotation)),
                "description": (
                    docstring["arguments"].get(key)
                    if key in docstring["arguments"]
                    else None
                ),
            }
            for key, val in signature.parameters.items()
        },
        "source": {
            "code": method.source,
            "lines": method.source_lines,
        },
        "props": {
            "isClassMethod": is_classmethod,
        },
        "examples": docstring["examples"],
    }

    return method_data


def document_instance_variable(
    variable: pdoc.doc.Variable, module_arguments: dict = None
) -> apiVariable:
    """Document instance variable and return dictionary with documentation."""
    if variable.docstring:
        description = parse_docstring(variable.docstring)["description"]
    elif module_arguments and variable.name in module_arguments:
        description = module_arguments[variable.name]
    else:
        description = None

    return {
        "name": variable.name,
        "annotation": sanitize_annotation(variable.annotation_str),
        "description": description,
    }


def document_class(cls: pdoc.doc.Class) -> apiClass:
    """Document class and return dictionary with documentation."""
    if not isinstance(cls, pdoc.doc.Class):
        cls = pdoc.doc.Class(cls)
    own_members = cls.own_members
    classmethods = {i.name for i in cls.classmethods}
    class_docstring = parse_docstring(cls.docstring)

    result = {
        "name": cls.name,
        "short_description": class_docstring["short_description"],
        "docstring": class_docstring["description"],
        "methods": {},
        "properties": [],
        "inherits_from": {
            i[1]: {
                "module": i[0],
                "members": [
                    (j.type, j.name)
                    for j in cls.inherited_members[i]
                    if not j.name.startswith("_") or j.name in INCLUDE_METHODS
                ],
            }
            for i in cls.inherited_members
            if i[0] != "builtins"
        },
        "examples": class_docstring["examples"],
    }

    # Constructor
    constructor: pdoc.doc.Function = cls.members.get("__init__", None)
    result["constructor"] = {
        "signature": constructor.signature_without_self.__str__(),
        "arguments": {
            key: {
                "default": str(val.default) if val.default != inspect._empty else None,
                "annotation": sanitize_annotation(repr(val.annotation)),
                "description": (
                    class_docstring["arguments"].get(key).replace("\n", " ")
                    if key in class_docstring["arguments"]
                    else None
                ),
            }
            for key, val in constructor.signature.parameters.items()
        },
        "source": {"code": constructor.source, "lines": constructor.source_lines},
    }

    for member in own_members:
        if member.name.startswith("_") and member.name not in INCLUDE_METHODS:
            continue
        if isinstance(member, pdoc.doc.Function):
            result["methods"][member.name] = document_method(
                member, is_classmethod=member.name in classmethods
            )
            continue
        elif isinstance(member, pdoc.doc.Variable):
            result["properties"].append(document_instance_variable(member))
            continue

    return result


def document_module(module: pdoc.doc.Module) -> apiModule:
    """Document module and return dictionary with documentation."""
    if not isinstance(module, pdoc.doc.Module):
        module = pdoc.doc.Module(module)

    parsed_docstring = parse_docstring(module.docstring)

    result = {
        "name": module.name,
        "slug": module.fullname.split("."),
        "docstring": parsed_docstring["description"].strip(),
        "constants": [
            document_instance_variable(const, module_arguments=parsed_docstring['arguments'])
            for const in module.variables
        ],
        "classes": [document_class(cls) for cls in module.classes],
        "functions": [
            document_method(func)
            for func in module.functions
            if not func.name.startswith("_")
        ],
        "submodules": [document_module(sub_module) for sub_module in module.submodules],
        "examples": parsed_docstring["examples"],
    }

    return result


class AutoDoc:
    """AutoDoc class to generate documentation for a module."""

    def __init__(self, module: ModuleType):
        """Initialize AutoDoc class.

        Args:
            module (ModuleType): Module to generate documentation for.
        """
        self.module = module

    def set_output_file(self, output_file: str) -> AutoDoc:
        """Set output file for documentation.

        Args:
            output_file (str): Output file for documentation.
        """
        self.output_file = output_file
        return self

    def generate(self, write: bool = True) -> apiModule:
        """Generate documentation for module."""
        module = pdoc.doc.Module(self.module)
        result = document_module(module)

        if write:
            if not self.output_file:
                raise ValueError("Output file not set.")
            with open(self.output_file, "w") as f:
                f.write(json.dumps(result, indent=2))

        return result


def sanitize_annotation(annotation: str) -> str:
    """Sanitize annotation string."""
    if not annotation or annotation == inspect._empty:
        return None
    return annotation.lstrip(":").strip()


if __name__ == "__main__":
    from bamboost.extensions import use_locking

    document_module(pdoc.doc.Module(use_locking))
