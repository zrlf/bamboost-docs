import { classes, RenderMarkdownString } from "./index";
import { RenderClass } from "./Class";
import { RenderMethod } from "./Method";
import type { ModuleObj } from "./types";
import cn from "clsx";
import { getComponents } from "nextra-theme-docs";

export function RenderModule({ data }: { data: ModuleObj }) {
  const components = getComponents({ isRawLayout: false });
  return (
    <div>
      <components.h1>{data.name}</components.h1>
      <RenderMarkdownString>{data.docstring}</RenderMarkdownString>
      {data.functions.length > 0 && (
        <ul className="space-y-5 mb-20">
          {data.functions.map((func) => (
            <RenderMethod
              data={func}
              key={func.name}
            />
          ))}
        </ul>
      )}

      <ul className="space-y-20 my-8">
        {data.classes.map((classObj) => (
          <RenderClass
            className={cn(
              "px-5 py-1 m-[-1.25rem] rounded-3xl pb-10",
              classes.backgroundClass,
            )}
            data={classObj}
            key={classObj.name}
          />
        ))}
      </ul>

      <p></p>
    </div>
  );
}
