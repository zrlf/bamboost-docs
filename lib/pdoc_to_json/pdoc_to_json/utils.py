import inspect
from typing import Any, Optional
import re


def sanitize_annotation(annotation: Any) -> Optional[str]:
    """
    Sanitize an annotation to a string representation.

    Args:
        annotation (Any): The annotation to sanitize.

    Returns:
        Optional[str]: The sanitized annotation as a string, or None if not applicable.
    """
    if not annotation or annotation == inspect._empty:
        return None
    return str(annotation).lstrip(":").strip()

def extract_signature(source_code: str) -> str:
    """
    Extract the signature from a source code string.

    Args:
        source_code (str): The source code to extract the signature from.

    Returns:
        The extracted signature, or None if not found.
    """
    pattern = r'(\(.*?\).*?:)'
    match = re.search(pattern, source_code, re.DOTALL)
    return f"{match.group(1)}" if match else None

