import { visit } from "unist-util-visit";

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

export default inlineCodeLinkPlugin;
