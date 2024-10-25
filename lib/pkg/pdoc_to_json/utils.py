import inspect
import re
from typing import Any, Optional

from pdoc.doc import _PrettySignature, _remove_collections_abc


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
    s = inspect.formatannotation(annotation)
    s = _remove_collections_abc(s)
    return s.lstrip(":").strip()


def extract_signature(source_code: str) -> str:
    """
    Extract the signature from a source code string.

    Args:
        source_code (str): The source code to extract the signature from.

    Returns:
        The extracted signature, or None if not found.
    """
    pattern = r"(\(.*?\).*?:)"
    match = re.search(pattern, source_code, re.DOTALL)
    return f"{match.group(1)}" if match else None


def extract_signature_from_signature(signature: _PrettySignature) -> str:
    """
    Extract the signature from a signature object.

    Args:
        signature (_PrettySignature): The signature object to extract the signature from.

    Returns:
        The extracted signature, or None if not found.
    """
    # s = str(signature)
    # 
    # # Remove annotations rendered by _PrettySignature
    # s = re.sub(r':\s*(?:[^,=\)]|\[[^\]]*\])+(?=[,=\)])', '', s)
    result = signature._params()
    # remove annotations from the result
    for i, s in enumerate(result):
        result[i] = re.sub(r':\s*(?:[^,=\)]|\[[^\]]*\])+(?=[,=\)])', '', s)
    return_annot = signature._return_annotation_str()

    total_len = sum(len(x) + 2 for x in result) + len(return_annot)

    if total_len > signature.MULTILINE_CUTOFF:
        rendered = "(\n    " + ",\n    ".join(result) + "\n)"
    else:
        rendered = "({})".format(", ".join(result))
    if return_annot:
        rendered += f" -> {return_annot}"

    return rendered
