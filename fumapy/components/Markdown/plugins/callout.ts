import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

// Custom Callout handling plugin
const calloutPlugin = () => (tree: any) => {
  visit(tree, "paragraph", (node, index, parent) => {
    const text = toString(node).trim();

    if (/^(Note|Notes|Warning|Warnings):/.test(text)) {
      const [type, ..._rest] = text.split(":");
      const calloutType = getCalloutType(type);

      // Replace the paragraph node with a custom callout node
      if (!index) return;

      parent.children[index] = {
        type: "element",
        data: {
          hName: "Callout", // Custom HTML tag
          hProperties: { type: calloutType }, // Properties for the HTML element
        },
        children: node.children.map((child: any, i: number) => {
          if (i === 0 && child.type === "text") {
            return {
              ...child,
              value: child.value.replace(/^[^:]+:\s*/, ""),
            };
          }
          return child;
        }),
      };
      return;
    }

    if (/^[A-Z][a-z]+:/.test(text)) {
      const [type, ..._rest] = text.split(":");

      // Replace the paragraph node with a custom callout node
      if (!index) return;

      parent.children[index] = {
        type: "element",
        data: {
          hName: "Card", // Custom HTML tag
          hProperties: { title: type }, // Properties for the HTML element
        },
        children: node.children.map((child: any, i: number) => {
          if (i === 0 && child.type === "text") {
            return {
              ...child,
              value: child.value.replace(/^[^:]+:\s*/, ""),
            };
          }
          return child;
        }),
      };
      return;
    }
  });
};

type CalloutType = "info" | "warn" | "error" | null;

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

export default calloutPlugin;
