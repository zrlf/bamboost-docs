import { ReactNode } from "react";
import { Source } from "../lib/source.api";
import { baseOptions } from "@/app/layout.config";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function getLayout(source: Source) {
  // I manually add a separator to the page tree
  const treeChildren = source.pageTree.children;

  const modifiedTreeChildren: [] = [];

  for (const child of treeChildren) {
    const isRoot = child.name?.toString().startsWith("bamboost");

    if (isRoot) {
      child.name = child.name?.toString().split("@")[0];

      // @ts-expect-error
      modifiedTreeChildren.push({
        type: "separator",
        // name: `Version: ${version?.replaceAll('\'', '')}`,
        name: (
          <span>
            Version:{" "}
            <code className="bg-muted p-1 rounded border">
              {source.version?.replaceAll("'", "")}
            </code>
          </span>
        ),
      });
      // @ts-expect-error
      modifiedTreeChildren.push(child);
      // @ts-expect-error
      modifiedTreeChildren.push({
        type: "separator",
        name: "Modules",
      });
    } else {
      // @ts-expect-error
      modifiedTreeChildren.push(child);
    }
  }
  const newPageTree = { name: "bamboost", children: modifiedTreeChildren };

  return ({ children }: { children: ReactNode }) => (
    <DocsLayout
      containerProps={source.options}
      tree={newPageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
