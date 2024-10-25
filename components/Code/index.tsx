import { Fragment } from "react";
import { codeToHast } from "shiki/bundle/web";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx, jsxs } from "react/jsx-runtime";
import { shikiTheme } from "@/constants";
import { components } from "./shared";

export async function Code({
  code,
  inline = false,
  noBackground = false,
  className,
}: {
  code: string;
  inline?: boolean;
  noBackground?: boolean;
  className?: string;
}) {
  if (!code) return null;
  
  const codeWithPreservedBlanks = code.replace(/^\s*$/gm, " ").trimEnd();
  const out = await codeToHast(codeWithPreservedBlanks, {
    lang: "python",
    themes: { ...shikiTheme },
  });

  const nodes = toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
    components: components(inline, noBackground, className),
  });

  return nodes;
}
