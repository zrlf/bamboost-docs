from types import ModuleType
from typing import Optional

import pdoc

from .documenters import document_module
from .models import ApiModule


class AutoDoc:
    """Class to generate documentation for a Python module."""

    def __init__(self, module: ModuleType):
        """
        Initialize the AutoDoc class.

        Args:
            module (ModuleType): The module to generate documentation for.
        """
        self.module = module
        self.output_file: Optional[str] = None

    def generate(self) -> ApiModule:
        """
        Generate the documentation for the module.

        Args:
            write (bool): Whether to write the output to a file.

        Returns:
            ApiModule: The documentation data structure.
        """
        module_doc = pdoc.doc.Module(self.module)
        result = document_module(module_doc)
        if hasattr(self.module, "__version__"):
            result["version"] = self.module.__version__

        return result
