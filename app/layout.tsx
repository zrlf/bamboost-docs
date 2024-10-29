import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
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
                { name: "TUI", value: "api-bamboostcli" },
              ],
            },
          }}
        >
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
