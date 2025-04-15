import { visit } from "unist-util-visit";

export default function remarkJupyterAdmonitions() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      const match = node.lang?.match(/^\{(\w+)\}(?:\s+(.*))?$/);
      if (!match) return;

      const calloutType = match[1];
      const calloutTitle = match[2]?.trim(); // Optional title

      const attributes = [
        {
          type: "mdxJsxAttribute",
          name: "type",
          value: calloutType,
        },
      ];

      if (calloutTitle) {
        attributes.push({
          type: "mdxJsxAttribute",
          name: "title",
          value: calloutTitle,
        });
      }

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "Callout",
        attributes,
        children: [
          {
            type: "text",
            value: node.value,
          },
        ],
      };
    });
  };
}
