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

import pdoc
from docstring_parser import parse

INCLUDE_METHODS = {
    "__getitem__",
    "__setitem__",
    "__len__",
    "__iter__",
}


def parse_docstring(docstring: str):
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
        "return": doc.returns.description if doc.returns else None,
        "examples": examples,
    }


def document_method(method: pdoc.doc.Function, is_classmethod=False) -> dict:
    """Document method and return dictionary with documentation."""
    docstring = parse_docstring(method.docstring)
    signature = method.signature

    method_data = {
        "docstring": docstring["description"],
        "signature": signature.__str__(),
        "returns": {
            "annotation": str(signature.return_annotation),
            "description": (
                docstring["return"].replace("\n", " ") if docstring["return"] else None
            ),
        },
        "arguments": {
            key: {
                "default": str(val.default) if val.default != inspect._empty else None,
                "annotation": (
                    str(val.annotation) if val.annotation != inspect._empty else None
                ),
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


def document_instance_variable(variable: pdoc.doc.Variable) -> dict:
    """Document instance variable and return dictionary with documentation."""
    return {
        "annotation": variable.annotation_str,
        "description": (
            parse_docstring(variable.docstring)["description"].replace("\n", " ")
            if variable.docstring
            else None
        ),
    }


def document_class(cls: pdoc.doc.Class) -> dict:
    """Document class and return dictionary with documentation."""
    own_members = cls.own_members
    classmethods = {i.name for i in cls.classmethods}
    class_docstring = parse_docstring(cls.docstring)

    result = {
        "name": cls.name,
        "short_description": class_docstring["short_description"],
        "docstring": class_docstring["description"],
        "methods": {},
        "variables": {},
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
    constructor = cls.members.get("__init__", None)
    result["constructor"] = {
        "signature": constructor.signature_without_self.__str__(),
        "arguments": {
            key: {
                "default": str(val.default) if val.default != inspect._empty else None,
                "annotation": (
                    str(val.annotation) if val.annotation != inspect._empty else None
                ),
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
            result["variables"][member.name] = document_instance_variable(member)
            continue

    return result


def document_module(module: pdoc.doc.Module) -> dict:
    """Document module and return dictionary with documentation."""
    result = {
        "name": module.fullname,
        "docstring": parse_docstring(module.docstring)["description"].strip(),
        "classes": {cls.name: document_class(cls) for cls in module.classes},
        "functions": {
            func.name: document_method(func)
            for func in module.functions
            if not func.name.startswith("_")
        },
        "submodules": {
            sub_module.name: document_module(sub_module)
            for sub_module in module.submodules
        },
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

    def generate(self, write: bool = True) -> None:
        """Generate documentation for module."""
        module = pdoc.doc.Module(self.module)
        result = document_module(module)

        if write:
            if not self.output_file:
                raise ValueError("Output file not set.")
            with open(self.output_file, "w") as f:
                f.write(json.dumps(result, indent=2))

        return result
