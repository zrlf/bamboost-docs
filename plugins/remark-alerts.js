import { visit } from "unist-util-visit";

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function remarkAlerts() {
  const markers = ["info", "warn", "error", "success"];
  const markerNameRE = markers === "*" ? "\\w+" : markers.join("|");
  const RE = new RegExp(`^\\[\\!(${markerNameRE})\\]([^\\n\\r]*)`);

  return (tree) => {
    visit(tree, "blockquote", (node, index, parent) => {
      const childNode = node.children.at(0);
      if (childNode?.type !== "paragraph") return;

      const content = childNode.children.at(0);
      if (content?.type !== "text") return;

      const match = content.value.match(RE);
      if (!match) return;

      const type = match[1].toLowerCase();
      const title = match[2].trim() || capitalize(type);

      // Remove the matched [!type] title from the first paragraph's text
      const matchText = match[0];
      content.value = content.value.slice(matchText.length).trimStart();

      // Replace blockquote with Callout
      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "Callout",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "type",
            value: type,
          },
          {
            type: "mdxJsxAttribute",
            name: "title",
            value: title,
          },
        ],
        children: node.children, // keep the original blockquote content (after strip)
      };
    });

    return tree;
  };
}
