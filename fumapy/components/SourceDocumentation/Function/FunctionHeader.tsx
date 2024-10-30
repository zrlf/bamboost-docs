"use client";
import { useState } from "react";
import FumaComponents from "fumadocs-ui/mdx";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FunctionInterface } from "../types";

export const FunctionHeader = ({
  data,
  signature,
  code,
}: {
  data: FunctionInterface;
  signature: JSX.Element;
  code: JSX.Element;
}) => {
  const [sourceCodeVisible, setSourceCodeVisible] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:justify-between w-full sm:items-center",
          "bg-secondary rounded-md px-4 mt-12 pb-2 sm:pb-0",
        )}
      >
        <FumaComponents.h4 id={data.name} className="my-2">
          <span>{data.name}</span>
          <span className="ml-2 leading-relaxed">{signature}</span>
        </FumaComponents.h4>
        <button
          className="text-xs border px-2 py-1 rounded size-fit text-muted-foreground text-nowrap"
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
      </div>
      {sourceCodeVisible && code}
    </>
  );
};
