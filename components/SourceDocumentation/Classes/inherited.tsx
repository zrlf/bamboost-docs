"use client";

import { useState } from "react";
import { LinkAnnotation } from "../annotation";
import { ChevronDown } from "lucide-react";
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
          {Object.entries(data).map(([cls, { module, members }]) => (
            <InheritedFromClass
              key={cls}
              module={module}
              cls={cls}
              members={members}
            />
          ))}
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
    <>
      <button
        onClick={() => setIsOpened(!isOpened)}
        className="border px-1 py-1 rounded text-muted-foreground text-sm"
      >
        {`${cls} | ${members.length} members`}
        <ChevronDown
          className={cn(
            "inline transition-all",
            isOpened ? "rotate-0" : "-rotate-90",
          )}
          size={18}
        />
      </button>

      {isOpened && (
        <ul className={cn("space-y-0 my-0 max-h-96 overflow-auto rounded border shadow-inner list-inside mt-2")}>
          {members.map(([type, name], index) => (
            <li key={index} className="my-0">
              <LinkAnnotation>
                {`${module}.${cls}.${name}` + (type == "function" ? "()" : "")}
              </LinkAnnotation>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
