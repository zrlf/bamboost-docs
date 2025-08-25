"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function Body({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleHashChange = () => {
      router.push(window.location.href);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [router]);

  return <body className="flex flex-col min-h-screen">{children}</body>;
}
