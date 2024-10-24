import re

from docstring_parser import DocstringStyle, parse

from .models import ParsedDocstring


def parse_docstring(docstring: str) -> ParsedDocstring:
    """
    Parse a docstring and extract structured information.

    Args:
        docstring (str): The docstring to parse.

    Returns:
        ParsedDocstring: The structured docstring data.
    """
    doc = parse(docstring, DocstringStyle.GOOGLE)

    # Extract examples
    examples_str = (
        doc.examples[0].description if doc.examples and doc.examples[0] else None
    )
    examples = re.split(r"\n\s*\n", examples_str.strip()) if examples_str else []

    return {
        "short_description": doc.short_description or "",
        "description": doc.description or "",
        "params": {param.arg_name: param for param in doc.params},
        "arguments": {param.arg_name: param.description for param in doc.params},
        "returns": doc.returns.description if doc.returns else None,
        "examples": examples,
    }
