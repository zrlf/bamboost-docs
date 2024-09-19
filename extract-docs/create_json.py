"""
This script is used to generate markdown files for each module and submodules
of the bamboost package. The markdown files are used to render the API documentation
on the website. It is specific to the TOC components of this website as it uses
`RenderModule` and `RenderClass` components to render the documentation.
"""

import os
import sys
from unittest.mock import Mock

os.environ["BAMBOOST_MPI"] = "0"
import bamboost
from autodoc import AutoDoc


class AttributeMock(Mock):
    """
    Mock class that returns a new mock instance on attribute access,
    preserving the attribute chain as the name.
    """

    def __init__(self, name="", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._name = name

    def __getattr__(self, name):
        # For each attribute access, return a new mock with the updated name
        new_name = f"{self._name}.{name}" if self._name else name
        mock = AttributeMock(name=new_name)
        setattr(self, name, mock)
        return mock

    def __repr__(self):
        return f"<{self._name}>"


# Mocking the fenics module
sys.modules["fenics"] = AttributeMock(name="fenics")

site_path = "../"
doc_path = os.path.join(site_path, "pages/API")
source_doc_json_file = "extract-docs/data/source_docs.json"
source_doc_json_file_abspath = os.path.join(site_path, source_doc_json_file)
source_docs = (
    AutoDoc(bamboost).set_output_file(source_doc_json_file_abspath).generate(write=True)
)
