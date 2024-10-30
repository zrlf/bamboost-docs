import { cn } from "@/lib/utils";
import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import { DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import {
  BookOpenText,
  Copyright,
  Gitlab,
  Library,
  Terminal,
} from "lucide-react";
import { createElement } from "react";

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: Partial<DocsLayoutProps> & BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex gap-4 items-center">
        <img src="/logo_round.png" className="w-6 object-contain"></img>
        Bamboost
      </div>
    ),
  },
  i18n: false,
  links: [
    {
      type: "icon",
      url: "https://gitlab.com/cmbm-ethz/bamboost",
      icon: <Gitlab />,
      text: "GitLab",
      on: "all",
    },
  ],
  sidebar: {
    // footer: (
    //   <div
    //     className={cn(
    //       "w-full flex gap-1 p-2 items-center justify-center",
    //       "text-xs font-light text-muted-foreground/50",
    //     )}
    //   >
    //     <Copyright size={"0.8rem"} strokeWidth="1.0" />
    //     2024, cmbm research
    //   </div>
    // ),
    banner: (
      <RootToggle
        options={[
          {
            title: "Docs",
            description: "Guides and tutorials",
            icon: (
              <BookOpenText
                size={24}
                className="text-[hsl(var(--primary-2))]"
              />
            ),
            url: "/docs",
          },
          {
            title: "API",
            description: "API reference",
            url: "/apidocs",
            icon: <Library size={24} className="text-[hsl(var(--primary))]" />,
          },
          {
            title: "TUI",
            description: "API reference for the terminal user interface",
            url: "/api-tui",
            icon: (
              <Terminal size={24} className="text-[hsl(var(--primary-tui))]" />
            ),
          },
        ]}
      />
    ),
  },
};
