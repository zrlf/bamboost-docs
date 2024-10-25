from typing import Any, Dict, List, Optional, TypedDict
from docstring_parser import DocstringParam


class ApiParameter(TypedDict, total=False):
    description: Optional[str]
    default: Optional[str]
    annotation: Optional[str]


class ApiReturn(TypedDict, total=False):
    description: Optional[str]
    annotation: Optional[str]


class ApiMethod(TypedDict, total=False):
    name: str
    docstring: Optional[str]
    signature: str
    returns: ApiReturn
    arguments: Dict[str, ApiParameter]
    source: Dict[str, Any]
    props: Dict[str, bool]
    examples: List[str]


class ApiVariable(TypedDict, total=False):
    name: str
    annotation: Optional[str]
    description: Optional[str]
    default: Optional[str]


class ApiClass(TypedDict, total=False):
    name: str
    short_description: str
    docstring: Optional[str]
    methods: Dict[str, ApiMethod]
    properties: List[ApiVariable]
    inherits_from: Dict[str, Any]
    examples: List[str]
    constructor: Dict[str, Any]


class ApiModule(TypedDict, total=False):
    name: str
    slug: List[str]
    docstring: str
    short_description: str
    classes: List[ApiClass]
    functions: List[ApiMethod]
    submodules: List[Any]  # Recursive types require 'Any' or string annotations
    attributes: List[ApiVariable]
    examples: List[str]
    version: Optional[str]


class ParsedDocstring(TypedDict, total=False):
    short_description: str
    description: str
    arguments: Dict[str, str]
    params: Dict[str, DocstringParam]
    returns: Optional[str]
    examples: List[str]
