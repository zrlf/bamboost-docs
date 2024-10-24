import { ModuleObj } from "@/components/SourceDocumentation/types";
import { StructuredData } from "fumadocs-core/mdx-plugins";

export function getStructuredData(data: ModuleObj): StructuredData {
  const headings: StructuredData["headings"] = [];
  const contents: StructuredData["contents"] = [];

  headings.push({ id: "attributes", content: "Attributes" });
  headings.push({ id: "functions", content: "Functions" });
  headings.push({ id: "classes", content: "Classes" });

  for (const attr of data.attributes) {
    contents.push({
      heading: "attributes",
      content: [attr.name, attr.description].join(": "),
    });
  }

  for (const func of data.functions) {
    headings.push({ id: func.name, content: func.name });
    if (func.docstring) {
      contents.push({ heading: func.name, content: func.docstring });
    }
    if (Object.keys(func.arguments).length > 0) {
      for (const [name, arg] of Object.entries(func.arguments)) {
        contents.push({
          heading: func.name,
          content: [name, arg.description].join(": "),
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

  for (const cls of data.classes) {
    headings.push({ id: cls.name, content: cls.name });
    if (cls.docstring) {
      contents.push({ heading: cls.name, content: cls.docstring });
    }
    if (cls.properties.length > 0) {
      for (const prop of cls.properties) {
        contents.push({
          heading: cls.name,
          content: [prop.name, prop.description].join(": "),
        });
      }
    }
    if (cls.constructor.docstring) {
      contents.push({
        heading: cls.name,
        content: cls.constructor.docstring,
      });
    }

    // Methods
    for (const [name, method] of Object.entries(cls.methods)) {
      if (!method) continue;
      const id = cls.name + name;

      headings.push({ id: id, content: name });
      if (method.docstring) {
        contents.push({ heading: id, content: method.docstring });
      }
      if (Object.keys(method.arguments).length > 0) {
        for (const [name, arg] of Object.entries(method.arguments)) {
          if (name === "self") continue;

          contents.push({
            heading: id,
            content: [name, arg.description].join(": "),
          });
        }
      }
      if (method.returns.description) {
        contents.push({
          heading: id,
          content: method.returns.description,
        });
      }
    }
  }

  return { headings, contents };
}

