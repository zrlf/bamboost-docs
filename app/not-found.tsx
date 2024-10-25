"use client";
import Link from "fumadocs-core/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";

    if (pathname.endsWith("/") && pathname !== "/") {
      const newPath = pathname.replace(/\/+$/, "");
      redirect(newPath);
    }
  }, []);

  return (
    <main className="flex flex-1 gap-8 h-20 flex-col justify-center items-center text-center transition-all duration-500 ease-in-out text-muted-foreground">
      <div className="flex gap-8 items-center text-xl">
        404
        <div className="h-8 w-px bg-muted-foreground"></div>
        Page not found
      </div>
      <span>
        Go back{" "}
        <Link href="/" className="underline text-primary font-bold inline">
          /home
        </Link>
      </span>
    </main>
  );
}
