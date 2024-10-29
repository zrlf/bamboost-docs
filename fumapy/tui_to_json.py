import json
import os

import griffe

from custom_griffe import CustomEncoder, parse_module

if __name__ == "__main__":
    bamboost = griffe.load("bamboostcli", docstring_parser="google", store_source=True)

    object_representation = parse_module(bamboost)

    # find the root directory of the project
    root_path = os.path.dirname(__file__)
    while not os.path.exists(os.path.join(root_path, "package.json")):
        root_path = os.path.dirname(root_path)
        if root_path == os.path.dirname(root_path):  # Reached the root directory
            raise FileNotFoundError(
                "Could not find project root of project containing package.json"
            )

    api_filename = "api-tui.json"

    with open(os.path.join(root_path, api_filename), "w") as file:
        json.dump(object_representation, file, cls=CustomEncoder, indent=2, full=True)
