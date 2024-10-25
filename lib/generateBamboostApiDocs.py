"""
This script is used to generate markdown files for each module and submodules
of the bamboost package. The markdown files are used to render the API documentation
on the website. It is specific to the TOC components of this website as it uses
`RenderModule` and `RenderClass` components to render the documentation.
"""

import json
import os
import sys
from unittest.mock import Mock

os.environ["BAMBOOST_MPI"] = "0"
import bamboost

from pdoc_to_json.pdoc_to_json import AutoDoc


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


if __name__ == "__main__":
    # Mocking the fenics module
    sys.modules["fenics"] = AttributeMock(name="fenics")

    site_path = os.path.dirname(__file__)
    while not os.path.exists(os.path.join(site_path, "package.json")):
        site_path = os.path.dirname(site_path)
        if site_path == os.path.dirname(site_path):  # Reached the root directory
            raise FileNotFoundError(
                "Could not find project root of project containing package.json"
            )

    source_doc_json_file = "bamboostAPIdoc.json"
    source_doc_json_file_abspath = os.path.join(site_path, source_doc_json_file)
    source_docs = AutoDoc(bamboost).generate()

    with open(source_doc_json_file_abspath, "w") as file:
        json.dump(source_docs, file, indent=2)
