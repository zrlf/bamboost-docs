"use client";
import { cn } from "@/fumapy/lib/utils";
import Link from "fumadocs-core/link";
import { Card } from "fumadocs-ui/components/card";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [showTagline, setShowTagline] = useState(false);
  const tagline =
    "Bamboost is a Python library built for datamanagement using the HDF5 file format. bamboost stands for a lightweight shelf which will boost your efficiency and which will totally break if you load it heavily. Just kidding, bamboo can fully carry pandas.";

  useEffect(() => {
    const timer = setTimeout(() => setShowTagline(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-1 gap-2 flex-col justify-center text-center transition-all duration-500 ease-in-out">
      <div
        className={cn(
          "transition-all duration-500 ease-in-out",
          showTagline ? "-translate-y-1/3" : "",
        )}
      >
        <h1 className="mb-4 text-2xl font-bold">
          Get a grip on your data
          <br /> with bamboost
        </h1>
        <p className="text-muted-foreground">
          You may click here{" "}
          <Link
            href="/docs"
            className="text-route-docs font-semibold underline"
          >
            /docs
          </Link>{" "}
          for the documentation.
        </p>
        <p className="text-muted-foreground">
          Or here{" "}
          <Link
            href="/apidocs"
            className="text-route-api font-semibold underline"
          >
            /apidocs
          </Link>{" "}
          for the API reference.
        </p>
      </div>
      <div className="mx-4">
        <div
          className={cn(
            "container max-w-2xl p-px relative bg-linear-to-br from-primary to-primary via-transparent rounded-[calc(0.5rem+1px)]",
            "transition-all duration-500 ease-in-out",
            "before:content-[''] before:-z-10 before:absolute before:inset-0 before:bg-linear-to-br before:from-route-docs before:to-route-docs before:via-transparent before:blur-lg",
            "brightness-90 hover:brightness-100 cursor-pointer",
            showTagline ? "max-h-60 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <Card
            title="What is bamboost?"
            className={cn(
              "border-none",
              "w-full border z-10 bg-opacity-100",
              "bg-background hover:bg-background", // Add this to ensure the card background doesn't spin
            )}
            href="/docs"
          >
            {tagline}
          </Card>
        </div>
      </div>
      <p className="text-muted-foreground/50 mt-10 text-sm">
        Also, here is the link{" "}
        <Link
          href="/api-tui"
          className="text-route-tui font-semibold underline"
        >
          /api-tui
        </Link>{" "}
        to the source documentation of the terminal user interface.
      </p>
    </main>
  );
}
