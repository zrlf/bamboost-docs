"use client";
import { useState } from "react";
import { MethodObj } from "../types";
import FumaComponents from "fumadocs-ui/mdx";
import { ChevronDown } from "lucide-react";

export const FunctionHeader = ({
  data,
  signature,
  code,
}: {
  data: MethodObj;
  signature: JSX.Element;
  code: JSX.Element;
}) => {
  const [sourceCodeVisible, setSourceCodeVisible] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between w-full sm:items-center bg-muted rounded-md px-4 mt-12">
        <FumaComponents.h3 id={data.name} className="my-4">
          <div className="">
            {data.name}
            {signature}
          </div>
        </FumaComponents.h3>
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
