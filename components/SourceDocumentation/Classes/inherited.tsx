"use client";

import { useState } from "react";
import { LinkAnnotation } from "../annotation";
import {
  ArrowDownCircleIcon,
  ChevronDown,
  ChevronDownCircle,
  ChevronDownCircleIcon,
  LucideChevronDownCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import fuma from "fumadocs-ui/mdx";

export const InheritedMembers = ({
  data,
}: {
  data: { [key: string]: { module: string; members: string[][] } };
}) => {
  return (
    <div>
      {Object.keys(data).length > 0 && (
        <>
          <fuma.h4 className="relative mt-12">Inherits</fuma.h4>
          <div className="space-y-8">
            {Object.entries(data).map(([cls, { module, members }]) => (
              <InheritedFromClass
                key={cls}
                module={module}
                cls={cls}
                members={members}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const InheritedFromClass = ({
  module,
  cls,
  members,
}: {
  module: string;
  cls: string;
  members: string[][];
}) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className={cn("relative border rounded", !isOpened && "cursor-pointer")} onClick={() => setIsOpened(true)}>
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-sm text-muted-foreground",
          "transition-all pointer-events-none backdrop-blur-lg rounded py-2 px-4 border",
          isOpened && "opacity-0",
        )}
      >
        {cls.split(".").slice(-1)}
        <span className="absolute -top-2 -right-2 bg-primary w-6 h-6 flex items-center justify-center text-primary-foreground text-xs rounded-full">
          {members.length}
        </span>
      </div>
      <div
        className={cn(
          "overflow-auto max-h-96 transition-all",
          !isOpened &&
            "max-h-20 overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:h-20 after:bg-gradient-to-t after:from-background after:to-transparent",
        )}
      >
        <ul className={cn("space-y-0 my-2 overflow-auto list-inside")}>
          {members.map(([type, name], index) => (
            <li key={index} className="my-0">
              <LinkAnnotation>
                {`${cls}.${name}` + (type == "function" ? "()" : "")}
              </LinkAnnotation>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpened(!isOpened);
        }}
        className={cn(
          "text-muted-foreground",
          "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10",
        )}
      >
        <ArrowDownCircleIcon
          strokeWidth="1"
          className={cn(
            "inline transition-all bg-background",
            isOpened ? "rotate-180" : "rotate-0",
          )}
          size={24}
        />
      </button>
    </div>
  );
};
