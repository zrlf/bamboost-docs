import typing as t

import griffe
from _griffe.encoders import _json_encoder_map


def stringify(expr):
    return "".join(
        elem if isinstance(elem, str) else elem.canonical_path
        for elem in expr.iterate(flat=True)
    )  # type: ignore[attr-defined]


class CustomEncoder(griffe.JSONEncoder):
    def default(self, obj: t.Any) -> t.Any:
        """Return a serializable representation of the given object.

        Parameters:
            obj: The object to serialize.

        Returns:
            A serializable representation.
        """

        try:
            if isinstance(obj, griffe.ExprCall):
                return str(obj)
            if isinstance(obj, griffe.Expr):
                return stringify(obj)
            return obj.as_dict(full=self.full)
        except AttributeError:
            return _json_encoder_map.get(type(obj), super().default)(obj)
