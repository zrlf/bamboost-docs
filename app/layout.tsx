import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              api: "/api/search",
              allowClear: true,
              tags: [
                { name: "API", value: "apidocs" },
                { name: "Documentation", value: "docs" },
              ],
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "bamboost",
  icons: {
    icon: "/favicon.ico",
  },
};
