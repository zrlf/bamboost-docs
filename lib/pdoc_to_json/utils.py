import inspect
from typing import Any, Optional


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
