from __future__ import annotations

import json
import typing as t

import griffe

from .models import Attribute, Class, Function, Module

from .simplify_docstring import simplify_docstring
from .utils import build_signature, filter_non_imported


def parse_module(m: griffe.Module) -> Module:
    out = simplify_docstring(m.docstring, m)
    res: Module = {
        "name": m.name,
        "path": m.path,
        "filepath": m.filepath,
        "description": out.description,
        "docstring": out.remainder,
        "attributes": out.attributes,
        "modules": {
            name: parse_module(value)
            for name, value in filter_non_imported(m.modules).items()
        },
        "classes": {
            name: parse_class(value)
            for name, value in filter_non_imported(m.classes).items()
        },
        "functions": {
            name: parse_function(value)
            for name, value in filter_non_imported(m.functions).items()
        },
    }
    return res


def parse_class(c: griffe.Class) -> Class:
    out = simplify_docstring(c.docstring, c)
    res: Class = {
        "name": c.name,
        "path": c.path,
        "description": out.description,
        "parameters": out.parameters,
        "attributes": out.attributes,
        "docstring": out.remainder,
        "functions": {
            name: parse_function(value) for name, value in c.functions.items()
        },
        "source": c.source,
    }
    return res


def parse_function(f: griffe.Function) -> Function:
    out = simplify_docstring(f.docstring, f)
    res: Function = {
        "name": f.name,
        "path": f.path,
        "signature": build_signature(f),
        "description": out.description,
        "parameters": out.parameters,
        "returns": out.returns,
        "docstring": out.remainder,
        "source": f.source,
    }
    return res
