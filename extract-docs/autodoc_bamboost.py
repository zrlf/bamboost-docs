"""
This script is used to generate markdown files for each module and submodules
of the bamboost package. The markdown files are used to render the API documentation
on the website. It is specific to the TOC components of this website as it uses
`RenderModule` and `RenderClass` components to render the documentation.
"""

import os
import sys
from unittest.mock import MagicMock, Mock

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
doc_path = os.path.join(site_path, "docs/autoDocs")
source_doc_json_file = "extract-docs/data/source_docs.json"
source_doc_json_file_abspath = os.path.join(site_path, source_doc_json_file)
source_docs = (
    AutoDoc(bamboost).set_output_file(source_doc_json_file_abspath).generate(write=True)
)


header_tmpl = """---
title: {title}
hide_table_of_contents: true
---

import {{ RenderClass, RenderModule }} from '@site/src/components/SourceDocumentation'
import {{ TableOfContents }} from '@site/src/components/TOC';
"""
header_tmpl += """
import sourceDoc from '@site/{source_doc_json_file}';
""".format(
    source_doc_json_file=source_doc_json_file
)


doc_card_links = """
import DocCardList from '@theme/DocCardList';

<DocCardList />
"""


def create_md_for_module(module: dict, index: int = 0) -> None:
    """
    Create markdown files for each module and submodules.
    """
    submodules = module["submodules"]

    basename = module["name"].split(".")[-1]
    module_path = "/".join(module["name"].split(".")[1:-1])

    filename = f"{index:02d}_{basename}.md"
    card_links = ""

    if len(submodules) > 0:
        for i, (key, submodule) in enumerate(submodules.items()):
            create_md_for_module(submodule, index=i)

        # Overwrite module_path and filename
        module_path = "/".join(module["name"].split(".")[1:])
        filename = f"index.md"
        card_links = doc_card_links

    # Create full path (doc_path/module_path/filename)
    module_path = os.path.join(doc_path, module_path)
    os.makedirs(module_path, exist_ok=True)
    f = open(os.path.join(module_path, filename), "w")

    header = header_tmpl.format(title=basename)
    f.write(header)
    f.write(
        f'\n<RenderModule data={{sourceDoc}} moduleFullName="{module["name"]}" />\n'
    )
    f.write(card_links)

    for class_name, _ in module["classes"].items():
        f.write(f"\n## {class_name}\n")
        f.write(
            f'\n<RenderClass data={{sourceDoc}} classFullName="{module["name"]}.{class_name}" />\n'
        )

    f.write("\n<TableOfContents />\n")
    f.close()


if __name__ == "__main__":
    for i, module in enumerate(source_docs["submodules"]):
        create_md_for_module(source_docs["submodules"][module], index=i)
