# Created: 2024-10-30
# Author: Flavio Lorez

import argparse
import json
import os

import griffe
from mksource import CustomEncoder, parse_module

DOCSTRING_TYPE = "google"
STORE_SOURCE = True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate python API documentation")
    parser.add_argument(
        "module", type=str, help="The module to generate documentation for"
    )
    parser.add_argument(
        "--dir",
        "-d",
        type=str,
        default=".",
        help="The directory to save the documentation in",
    )
    args = parser.parse_args()

    pkg = parse_module(
        griffe.load(
            args.module, docstring_parser=DOCSTRING_TYPE, store_source=STORE_SOURCE
        )
    )
    api_filename = f"{args.module}.json"

    with open(os.path.join(args.dir, api_filename), "w") as file:
        json.dump(pkg, file, cls=CustomEncoder, indent=2, full=True)
