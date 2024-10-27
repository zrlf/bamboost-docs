import typing as t

import griffe

SimplifiedDocstring = t.NamedTuple(
    "DocComponents",
    [
        ("description", str),
        ("parameters", list),
        ("returns", dict),
        ("attributes", list),
        ("remainder", list),
    ],
)


def simplify_docstring(
    doc: griffe.Docstring, parent: griffe.Module | griffe.Class | griffe.Function = None
) -> SimplifiedDocstring:
    def get_parameters_from_signature(parent: griffe.Class | griffe.Function):
        return [
            {
                "name": p.name,
                "annotation": p.annotation,
                "description": None,
                "value": p.default,
            }
            for p in parent.parameters
        ]

    def get_returns_from_signature(parent: griffe.Function):
        return {
            "name": "",
            "annotation": (
                parent.returns
                if isinstance(parent.returns, (str, type(None)))
                else parent.returns.canonical_path
            ),
            "description": None,
        }

    def get_attributes_from_signature(parent: griffe.Module | griffe.Class):
        return [
            {
                "name": attr.name,
                "annotation": attr.annotation,
                "description": None,
                "value": attr.value,
            }
            for attr in parent.attributes.values()
        ]

    if not doc:
        if not parent:
            return None

    description = None
    parameters = (
        get_parameters_from_signature(parent)
        if isinstance(parent, (griffe.Class, griffe.Function))
        else None
    )
    attributes = (
        get_attributes_from_signature(parent)
        if isinstance(parent, (griffe.Class, griffe.Module))
        else None
    )
    returns = (
        get_returns_from_signature(parent)
        if isinstance(parent, (griffe.Function))
        else None
    )
    remainder = []
    if not doc:
        return SimplifiedDocstring(
            description, parameters, returns, attributes, remainder
        )

    for i, sec in enumerate(doc.parsed):
        if sec.kind == "text" and i == 0:
            description = sec.value
            continue

        # Sort the parameters with the real signature
        if sec.kind == "parameters":
            map = {i.name: i for i in sec.value}
            params_list = []
            for param in parent.parameters:
                if param.name in map:
                    params_list.append(map[param.name])
                else:
                    params_list.append(
                        {
                            "name": param.name,
                            "annotation": param.annotation,
                            "description": None,
                            "value": param.default,
                        }
                    )

            parameters = params_list
            continue

        if sec.kind == "returns":
            returns: griffe.DocstringReturn = sec.value[0]
            returns.annotation = (
                returns.annotation.canonical_path
                if isinstance(returns.annotation, griffe.Expr)
                else returns.annotation
            )
            continue

        if sec.kind == "attributes":
            map = {i.name: i for i in sec.value}
            attributes_list = []
            for attr in parent.attributes.values():
                if attr.name in map:
                    attr_item: dict = map[attr.name].as_dict()
                    attr_item.update({"value": attr.value})
                    attributes_list.append(attr_item)
                else:
                    attributes_list.append(
                        {
                            "name": attr.name,
                            "annotation": attr.annotation,
                            "description": None,
                            "value": attr.value,
                        }
                    )
            attributes = attributes_list
            continue

        remainder.append(sec)

    return SimplifiedDocstring(description, parameters, returns, attributes, remainder)
