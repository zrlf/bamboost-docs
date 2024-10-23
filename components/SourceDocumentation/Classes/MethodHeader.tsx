"use client";
import FumaComponents from "fumadocs-ui/mdx";
import { MethodObj } from "../types";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MethodHeaderProps {
  name?: string;
  clsName?: string;
  signature: JSX.Element;
  code: JSX.Element;
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
          "flex flex-col sm:flex-row sm:justify-between sm:items-center w-full",
          "bg-secondary/50 rounded-md px-4 mt-12 mb-4 border",
        )}
      >
        <div className="">
          {isClassMethod}
          <FumaComponents.h4
            id={id}
            className={cn(isClassMethod ? "my-2 mt-0" : "my-2")}
          >
            {isConstructor && (
              <span className="text-foreground mr-2">Constructor:</span>
            )}
            {clsName && (
              <span
                className={cn(
                  "text-muted-foreground text-base",
                  isConstructor && "text-foreground",
                )}
              >
                {clsName}
              </span>
            )}
            {clsName && name && (
              <span className="text-muted-foreground mx-1">.</span>
            )}
            {name}
            {signature}
          </FumaComponents.h4>
        </div>
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
}
