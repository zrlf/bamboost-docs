import { classes, Markdown } from "./index";
import { RenderClass } from "./Class";
import { RenderMethod } from "./Method";
import type { ModuleObj } from "./types";
import cn from "clsx";
import { getComponents } from "nextra-theme-docs";
import styles from "./styles.module.css";

export function RenderModule({ data }: { data: ModuleObj }) {
  const components = getComponents({ isRawLayout: false });
  return (
    <div>
      <components.h1>{data.name}</components.h1>
      <Markdown>{data.docstring}</Markdown>
      {data.functions.length > 0 && (
        <ul className="space-y-5 mb-20">
          {data.functions.map((func) => (
            <RenderMethod data={func} key={func.name} />
          ))}
        </ul>
      )}

      <ul className="space-y-20 my-8">
        {data.classes.map((classObj) => (
          <RenderClass
            className={cn(
              "relative",
              styles.classContainer,
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
