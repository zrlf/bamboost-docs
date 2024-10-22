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
import { Callout } from "fumadocs-ui/components/callout";
import { Card } from "fumadocs-ui/components/card";

type CalloutType = "info" | "warn" | "error" | null;

interface MarkdownProps {
  input: string | React.ReactNode[];
}

export default function Markdown({ input }: MarkdownProps): JSX.Element {
  // If the input is an array of React nodes, render them directly
  if (Array.isArray(input)) {
    return (
      <div>
        {input.map((component, index) => (
          <React.Fragment key={`markdown-part-${index}`}>
            {component}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // If the input is a string, render it as markdown
  return renderMarkdown(input);
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
          hProperties: { type: calloutType, title: "moin" }, // Properties for the HTML element
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

const getComponent = (admonitionType: string) => {
  switch (admonitionType) {
    case "Note":
    case "Notes":
    case "Info":
    case "Tip":
      return (children: React.ReactNode) => (
        <Callout type="info">{children}</Callout>
      );
    case "Warning":
      return (children: React.ReactNode) => (
        <Callout type="warn">{children}</Callout>
      );
    case "Error":
      return (children: React.ReactNode) => (
        <Callout type="error">{children}</Callout>
      );
    default:
      return (children: React.ReactNode) => (
        <Card title={admonitionType}>{children}</Card>
      );
  }
};

export function splitParagraph(input: string): React.ReactNode[] {
  // Function to get the indentation level of a line
  function getIndentationLevel(line: string) {
    const match = line.match(/^ */);
    return match ? match[0].length : 0;
  }

  const lines = input.split("\n");
  const parts = [];
  let currentPart = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Match a Single capitalised word followed by a colon
    const indicatorMatch = line.match(new RegExp(`^([A-Z][a-z]+):\s*$`, ""));

    if (indicatorMatch) {
      // Save current part before the indicator
      if (currentPart.length > 0) {
        parts.push(
          React.createElement(
            "div",
            {},
            renderMarkdown(currentPart.join("\n")),
          ),
        );
        currentPart = [];
      }

      const indicator = indicatorMatch[1];
      const indicatorIndentLevel = getIndentationLevel(line);
      const annotationBlockIndentLevel =
        i + 1 < lines.length ? getIndentationLevel(lines[i + 1]) : 0;
      const indentedBlockLines = [];
      i++; // Move to the next line

      // Collect the indented block after the indicator
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextLineIndentLevel = getIndentationLevel(nextLine);
        // Check if the line is indented more than the indicator
        if (
          nextLine.trim() === "" ||
          nextLineIndentLevel > indicatorIndentLevel
        ) {
          // Slice the line by exactly the number of spaces equal to indicatorIndentLevel
          const slicedLine = nextLine.slice(annotationBlockIndentLevel);
          indentedBlockLines.push(slicedLine);
          i++;
        } else {
          break;
        }
      }

      // Save the indicator and its indented block as an object
      parts.push(
        getComponent(indicator)(
          renderMarkdown(indentedBlockLines.join("\n").trim()),
        ),
      );
    } else {
      currentPart.push(line);
      i++;
    }
  }

  // Save any remaining text after the last indicator
  if (currentPart.length > 0) {
    // parts.push({ indicator: null, content: currentPart.join("\n").trim() });
    parts.push(
      React.createElement("div", {}, renderMarkdown(currentPart.join("\n"))),
    );
  }

  return parts;
}
