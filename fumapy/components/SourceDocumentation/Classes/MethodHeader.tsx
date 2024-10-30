"use client";
import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/fumapy/lib/utils";

interface MethodHeaderProps {
  code: JSX.Element | null;
  header: ReactNode,
}

export default function MethodHeader({
  code,
  header,
}: MethodHeaderProps) {
  const [sourceCodeVisible, setSourceCodeVisible] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:justify-between sm:items-center",
          "px-4 mb-4 pb-2 sm:pb-0",
          "bg-secondary rounded",
        )}
      >
        {header}

        {code && (
          <button
            className="text-xs border px-2 py-1 rounded size-fit text-muted-foreground text-nowrap hover:bg-secondary-foreground/5 transition-colors"
            onClick={() => setSourceCodeVisible(!sourceCodeVisible)}
          >
            Source code{" "}
            <ChevronDown
              className="inline transition-all"
              size={16}
              style={{
                rotate: sourceCodeVisible ? "0deg" : "-90deg",
              }}
            />
          </button>
        )}
      </div>

      {sourceCodeVisible && code}
    </>
  );
}
