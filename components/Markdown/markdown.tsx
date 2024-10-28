import React from "react";
import { unified } from "unified";
import * as prod from "react/jsx-runtime";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { LinkAnnotation } from "../SourceDocumentation/annotation";
import { Code } from "../Code";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import { remarkGfm } from "fumadocs-core/mdx-plugins";
import inlineCodeLinkPlugin from "./plugins/inline-code";
import remarkPythonPrompt from "./plugins/remark-python-prompt";
import calloutPlugin from "./plugins/callout";

interface MarkdownProps {
  input: string;
}

export default function Markdown({ input }: MarkdownProps): JSX.Element {
  return <div className="last:mb-4">{renderMarkdown(input)}</div>;
}

export function renderMarkdown(input: string): JSX.Element {
  const processor = unified()
    .use(remarkParse) // Parses the markdown into a syntax tree
    .use(inlineCodeLinkPlugin) // Add crosslinks to bamboost members
    .use(remarkPythonPrompt.plugin) // Parse python prompt syntax to code blocks
    .use(calloutPlugin) // Parse google style callout syntax to callout components
    .use(remarkGfm) // Adds support for GFM (GitHub Flavored Markdown)
    .use(remarkRehype) // Converts the markdown syntax tree to HTML syntax tree
    // @ts-expect-error
    .use(rehypeReact, {
      Fragment: prod.Fragment,
      jsx: prod.jsx,
      jsxs: prod.jsxs,
      components: {
        ...defaultMdxComponents,
        LinkAnnotation: (props: any) => <LinkAnnotation {...props} />,
        Code: (props: { code: string }) => <Code {...props} />,
      },
    });

  const preprocessedInput = remarkPythonPrompt.preprocess(input);
  return processor.processSync(preprocessedInput).result;
}
