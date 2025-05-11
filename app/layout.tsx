import Link from "fumadocs-core/link";
import { Banner } from "fumadocs-ui/components/banner";
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
          <Banner variant="rainbow" id="dev-version-banner">
            <div>
              You are viewing the documentation for the <b>dev</b> branch of
              bamboost.{" "}
              <Link
                href="https://bamboost.ch"
                className="underline decoration-primary font-bold"
              >
                View the stable version instead
              </Link>
              .
            </div>
          </Banner>
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
