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
  className,
}: {
  code: string;
  inline?: boolean;
  noBackground?: boolean;
  link?: boolean;
  className?: string;
}) {
  if (!code) return null;
  if (link) {
    const linkedCode = LinkAnnotation({ children: code, returnNull: true });
    if (linkedCode !== null) return linkedCode;
  }

  const codeWithPreservedBlanks = code.replace(/^\s*$/gm, " ").trimEnd();
  const out = await codeToHast(codeWithPreservedBlanks, config.shiki);

  const nodes = toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
    components: components(inline, noBackground, className),
  });

  return nodes;
}
