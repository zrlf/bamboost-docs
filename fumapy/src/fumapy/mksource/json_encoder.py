import typing as t

import griffe
from _griffe.encoders import _json_encoder_map


def stringify_annotation(obj: griffe.Expr | None | str) -> t.Any:
    if isinstance(obj, (str, type(None))):
        return obj

    if isinstance(obj, (griffe.ExprTuple, griffe.ExprList)):
        return ", ".join(tuple(stringify_annotation(item) for item in obj.elements))

    if isinstance(obj, (griffe.ExprName, griffe.ExprAttribute, griffe.ExprBinOp)):
        return obj.canonical_path

    string_representation = obj.canonical_path
    string_representation += "[" + stringify_annotation(obj.slice) + "]"

    return string_representation


class CustomEncoder(griffe.JSONEncoder):
    def default(self, obj: t.Any) -> t.Any:
        """Return a serializable representation of the given object.

        Parameters:
            obj: The object to serialize.

        Returns:
            A serializable representation.
        """

        try:
            if isinstance(obj, griffe.ExprSubscript):
                return stringify_annotation(obj)
            if isinstance(obj, griffe.Expr):
                return obj.path
            return obj.as_dict(full=self.full)
        except AttributeError:
            return _json_encoder_map.get(type(obj), super().default)(obj)
