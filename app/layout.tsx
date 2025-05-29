import type { ReactNode } from "react";
import { Body } from "./layout.client";
import { GeistSans } from "geist/font/sans";
import "katex/dist/katex.css";
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { CustomSearchDialog } from "@/components/searchOrama";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <Body>
        <RootProvider search={{ SearchDialog: CustomSearchDialog }}>
          {children}
        </RootProvider>
      </Body>
    </html>
  );
}

export const metadata = {
  title: "bamboost",
  icons: {
    icon: "/favicon.ico",
  },
};
