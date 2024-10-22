import React from "react";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import { remarkGfm } from "fumadocs-core/mdx-plugins";
import * as prod from "react/jsx-runtime";
import { toString } from "mdast-util-to-string";
import defaultMdxComponents from "fumadocs-ui/mdx";

// Plugin to replace inline code with links
const inlineCodeLinkPlugin = () => (tree: any) => {
  visit(tree, "inlineCode", (node: any, index: any, parent: any) => {
    const url = node.value;
    parent.children[index] = {
      type: "link",
      url: url,
      children: [
        {
          type: "inlineCode",
          value: url,
        },
      ],
    };
  });
};

// Custom Callout handling plugin
const calloutPlugin = () => (tree: any) => {
  visit(tree, "paragraph", (node, index, parent) => {
    const text = toString(node).trim();

    if (/^(Note|Notes|Warning|Warnings):/.test(text)) {
      const [type, ...rest] = text.split(":");
      const calloutType = ["Note", "Notes"].includes(type) ? "info" : "warn";
      const content = rest.join(":").trim();

      // Replace the paragraph node with a custom callout node
      if (!index) return;

      parent.children[index] = {
        type: "paragraph",
        data: {
          hName: "Callout", // Custom HTML tag
          hProperties: { type: calloutType }, // Properties for the HTML element
        },
        children: [
          {
            type: "text",
            value: content,
          },
        ],
      };
    }
  });
};

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  const processor = unified()
    .use(remarkParse) // Parses the markdown into a syntax tree
    .use(calloutPlugin)
    .use(inlineCodeLinkPlugin)
    .use(remarkGfm)
    .use(remarkRehype) // Converts the markdown syntax tree to HTML syntax tree
    // @ts-expect-error
    .use(rehypeReact, {
      Fragment: prod.Fragment,
      jsx: prod.jsx,
      jsxs: prod.jsxs,
      components: {
        ...defaultMdxComponents,
      },
    });

  return processor.processSync(children).result;
}
