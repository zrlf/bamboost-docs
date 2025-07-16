import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { RootProvider } from "fumadocs-ui/provider";
import { CustomSearchDialog } from "@/components/searchOrama";
import { Metadata } from "next";
import "katex/dist/katex.css";
import "./global.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <RootProvider search={{ SearchDialog: CustomSearchDialog }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "bamboost",
  icons: {
    icon: "/favicon.ico",
  },
};
