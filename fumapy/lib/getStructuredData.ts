import { DocstringSection, ModuleInterface } from "../components/SourceDocumentation/types";
import { StructuredData } from "fumadocs-core/mdx-plugins";

function stringifyDescription(
  description: string | DocstringSection[] | null,
): string {
  function stringifyExpr(
    expr: string | { annotation: string; description: string },
  ): string {
    if (typeof expr === "string") return expr;
    return expr.description;
  }

  if (description === null) return "";
  if (typeof description === "string") return description;
  return description.map((section) => stringifyExpr(section.value)).join("\n");
}

export function getStructuredData(data: ModuleInterface): StructuredData {
  const headings: StructuredData["headings"] = [];
  const contents: StructuredData["contents"] = [];

  headings.push({ id: "attributes", content: "Attributes" });
  headings.push({ id: "functions", content: "Functions" });
  headings.push({ id: "classes", content: "Classes" });

  for (const attr of data.attributes) {
    contents.push({
      heading: "attributes",
      content: [attr.name, stringifyDescription(attr.description)].join(": "),
    });
  }

  for (const func of Object.values(data.functions)) {
    headings.push({ id: func.name, content: func.name });
    if (func.docstring) {
      contents.push({ heading: func.name, content: func.description || "" });
    }
    if (func.parameters.length > 0) {
      for (const param of func.parameters) {
        contents.push({
          heading: func.name,
          content: [param.name, stringifyDescription(param.description)].join(": "),
        });
      }
    }
    if (func.returns.description) {
      contents.push({
        heading: func.name,
        content: func.returns.description,
      });
    }
  }

  for (const cls of Object.values(data.classes)) {
    headings.push({ id: cls.name, content: cls.name });
    if (cls.docstring) {
      contents.push({ heading: cls.name, content: cls.description || "" });
    }
    if (cls.attributes.length > 0) {
      for (const prop of cls.attributes) {
        contents.push({
          heading: cls.name,
          content: [prop.name, prop.description].join(": "),
        });
      }
    }
    if (cls.functions["__init__"] && cls.functions["__init__"].docstring) {
      contents.push({
        heading: cls.name,
        content: cls.functions["__init__"].description || "",
      });
    }

    // Methods
    for (const func of Object.values(cls.functions)) {
      if (!func) continue;
      const id = `${cls.name}.${func.name}`;

      headings.push({ id: id, content: func.name });
      if (func.description) {
        contents.push({ heading: id, content: func.description });
      }
      if (func.parameters?.length > 0) {
        for (const param of func.parameters) {
          if (param.name === "self") continue;

          contents.push({
            heading: id,
            content: [param.name, stringifyDescription(param.description)].join(": "),
          });
        }
      }
      if (func.returns?.description) {
        contents.push({
          heading: id,
          content: func.returns.description,
        });
      }
    }
  }

  return { headings, contents };
}
