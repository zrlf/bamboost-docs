import Link from "fumadocs-core/link";
import { Banner } from "fumadocs-ui/components/banner";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./global.css";
import { Body } from "./layout.client";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <Body>
        <RootProvider
          search={{
            options: {
              api: "/api/search",
              allowClear: true,
              type: "static",
              tags: [
                { name: "API", value: "api-bamboost" },
                { name: "Documentation", value: "docs" },
                // { name: "TUI", value: "api-bamboostcli" },
              ],
            },
          }}
        >
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
