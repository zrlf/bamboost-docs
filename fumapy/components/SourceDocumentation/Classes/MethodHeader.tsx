"use client";
import { cn } from "@/fumapy/lib/utils";
import { ChevronDown } from "lucide-react";
import { JSX, ReactNode, useState } from "react";

interface MethodHeaderProps {
  code: JSX.Element | null;
  header: ReactNode;
  standalone?: boolean;
  className?: string;
}

export default function MethodHeader({
  code,
  header,
  className,
}: MethodHeaderProps) {
  const [sourceCodeVisible, setSourceCodeVisible] = useState(false);

  return (
    <>
      <div
        className={cn(
          className,
          "function-header",
          "rounded-xl",
        )}
      >
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:justify-between sm:items-center",
            "px-4 mb-0 pb-0",
          )}
        >
          {header}

          {code && (
            <button
              className="text-xs border px-2 mb-2 sm:mb-0 py-1 rounded-sm size-fit text-muted-foreground text-nowrap hover:bg-secondary-foreground/5 transition-colors"
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
      </div>
    </>
  );
}
