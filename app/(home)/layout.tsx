import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { BookOpenText, Library } from "lucide-react";

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <HomeLayout
      {...baseOptions}
      className="flex flex-col min-h-screen"
      links={[
        // @ts-expect-error
        ...baseOptions.links,
        ...[
          {
            text: (
              <span className="flex gap-2 items-center">
                <BookOpenText />
                Documentation
              </span>
            ),
            url: "/docs",
            active: "nested-url",
          },
          {
            text: (
              <span className="flex gap-2 rounded-lg items-center">
                <Library />
                API bamboost
              </span>
            ),
            url: "/apidocs",
            active: "nested-url",
          },
          // {
          //   text: (
          //     <span className="flex gap-2 rounded-lg items-center">
          //       <Terminal />
          //       API tui
          //     </span>
          //   ),
          //   url: "/api-tui",
          //   active: "nested-url",
          // },
        ],
      ]}
    >
      {children}
    </HomeLayout>
  );
}
