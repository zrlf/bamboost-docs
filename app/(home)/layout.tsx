import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <HomeLayout
      {...baseOptions}
      links={[
        {
          text: "Documentation",
          url: "/docs",
          active: "nested-url",
        },
        {
          text: "API Reference",
          url: "/apidocs",
          active: "nested-url",
        },
        {
          text: "TUI Reference",
          url: "/api-tui",
          active: "nested-url",
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
