import { baseOptions } from "@/app/layout.config";
import { docSource } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import "katex/dist/katex.css";
import { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      containerProps={{ className: "route-docs" }}
      tree={docSource.pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
