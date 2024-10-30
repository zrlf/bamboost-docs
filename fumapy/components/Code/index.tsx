import { Fragment } from "react";
import { codeToHast } from "shiki/bundle/web";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx, jsxs } from "react/jsx-runtime";
import { components } from "./shared";
import { LinkAnnotation } from "../SourceDocumentation/annotation";
import config from "@/fumapy.config";

export async function Code({
  code,
  inline = false,
  noBackground = false,
  link = false,
  handleNewLine = false,
  className,
}: {
  code: string;
  inline?: boolean;
  noBackground?: boolean;
  link?: boolean;
  handleNewLine?: boolean;
  className?: string;
}) {
  if (!code) return null;
  if (link) {
    const linkedCode = LinkAnnotation({ children: code, returnNull: true });
    if (linkedCode !== null) return linkedCode;
  }

  let codeWithPreservedBlanks = code.replace(/^\s*$/gm, " ").trimEnd();
  // handle new line characters \n
  if (handleNewLine) {
    codeWithPreservedBlanks = codeWithPreservedBlanks.replace(/\\n/g, "\n");
  }
  const out = await codeToHast(codeWithPreservedBlanks, config.shiki);

  const nodes = toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
    components: components(inline, noBackground, className),
  });

  return nodes;
}
