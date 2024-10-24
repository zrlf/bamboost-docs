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

export const InheritedMembers = ({
  data,
}: {
  data: { [key: string]: { module: string; members: string[][] } };
}) => {
  return (
    <div>
      {Object.keys(data).length > 0 && (
        <>
          <h4 className="relative">Inherits</h4>
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
    <div
      className="relative border rounded"
      onClick={() => setIsOpened(true)}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-sm text-muted-foreground">
        {`${cls} | ${members.length} members`}
      </div>
      <div
        className={cn(
          "overflow-hidden",
          !isOpened &&
          "max-h-20 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-20 after:bg-gradient-to-t after:from-background after:to-transparent",
        )}
      >
        <ul className={cn("space-y-0 my-2 max-h-96 overflow-auto list-inside")}>
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
