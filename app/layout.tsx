import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { Provider } from "./provider";
import { Metadata } from "next";
import "katex/dist/katex.css";
import "./global.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
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
