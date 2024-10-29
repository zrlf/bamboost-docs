"use client";
import FumaComponents from "fumadocs-ui/mdx";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MethodHeaderProps {
  name?: string;
  clsName?: string;
  signature: JSX.Element;
  code: JSX.Element | null;
  id?: string;
  isClassMethod?: JSX.Element;
  isConstructor?: boolean;
}

export default function MethodHeader({
  name,
  clsName,
  signature,
  code,
  id,
  isClassMethod,
  isConstructor,
}: MethodHeaderProps) {
  const [sourceCodeVisible, setSourceCodeVisible] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:justify-between sm:items-center",
          "bg-secondary rounded-md px-4 mb-4 pb-2 sm:pb-0",
          // "border-l-class/50 border-l-4",
        )}
      >
        <div className="">
          {isClassMethod}
          <FumaComponents.h4
            id={id}
            className={cn(isClassMethod ? "my-2 mt-0" : "my-2", "")}
          >
            {clsName && (
              <span
                className={cn(
                  "text-muted-foreground/80 text-base",
                  isConstructor && "text-foreground",
                )}
              >
                {clsName}
              </span>
            )}
            {clsName && name && (
              <span className="text-muted-foreground/80 mx-0.5">.</span>
            )}
            <span className="font-bold">{name}</span>
            <span className="leading-relaxed break-all">{signature}</span>
          </FumaComponents.h4>
        </div>

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
