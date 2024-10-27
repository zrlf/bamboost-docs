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
import { LinkAnnotation } from "../SourceDocumentation/annotation";

type CalloutType = "info" | "warn" | "error" | null;

interface MarkdownProps {
  input: string;
}

export default function Markdown({ input }: MarkdownProps): JSX.Element {
  return <div className="last:mb-4">{renderMarkdown(input)}</div>;
}

function renderMarkdown(input: string): JSX.Element {
  const processor = unified()
    .use(remarkParse) // Parses the markdown into a syntax tree
    .use(inlineCodeLinkPlugin)
    .use(calloutPlugin)
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
      },
    });

  return processor.processSync(input).result;
}

// Plugin to replace inline code with links
const inlineCodeLinkPlugin = () => (tree: any) => {
  visit(tree, "inlineCode", (node: any, index: any, parent: any) => {
    const value = node.value;
    if (/^bamboost\./.test(value)) {
      // Only create a link if the inline code looks like a URL
      parent.children[index] = {
        type: "element",
        url: value,
        data: {
          hName: "LinkAnnotation",
        },
        children: [
          {
            type: "text",
            value: value,
          },
        ],
      };
    }
    // If it's not a URL, leave the inline code as is
  });
};

// Custom Callout handling plugin
const calloutPlugin = () => (tree: any) => {
  visit(tree, "paragraph", (node, index, parent) => {
    const text = toString(node).trim();

    if (/^(Note|Notes|Warning|Warnings):/.test(text)) {
      const [type, ...rest] = text.split(":");
      const calloutType = getCalloutType(type);
      const content = rest.join(":").trim();

      // Replace the paragraph node with a custom callout node
      if (!index) return;

      parent.children[index] = {
        type: "element",
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
      return;
    }

    if (/^[A-Z][a-z]+:/.test(text)) {
      const [type, ...rest] = text.split(":");
      const content = rest.join(":").trim();

      // Replace the paragraph node with a custom callout node
      if (!index) return;

      parent.children[index] = {
        type: "element",
        data: {
          hName: "Card", // Custom HTML tag
          hProperties: { title: type }, // Properties for the HTML element
        },
        children: [
          {
            type: "text",
            value: content,
          },
        ],
      };
      return;
    }
  });
};

const getCalloutType = (type: string): CalloutType => {
  switch (type) {
    case "Note":
    case "Notes":
    case "Info":
    case "Tip":
      return "info";
    case "Warning":
      return "warn";
    case "Error":
      return "error";
    default:
      return null;
  }
};
