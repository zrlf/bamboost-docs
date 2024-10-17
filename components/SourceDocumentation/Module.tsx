import { Divider, Markdown } from "./index";
import { ArgumentList, RenderClass } from "./Class";
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

      {data.constants && data.constants.length > 0 && (
        <>
          <components.h2 style={{ marginBottom: "2rem" }}>
            Constants
          </components.h2>
          <ArgumentList args={data.constants} />
        </>
      )}

      {data.functions.length > 0 && (
        <>
          <components.h2>Functions</components.h2>
          <ul className="space-y-5 mb-20">
            {data.functions.map((func) => (
              <RenderMethod data={func} key={func.name} />
            ))}
          </ul>
        </>
      )}

      {data.classes.length > 0 && <components.h2>Classes</components.h2>}
      <ul className="space-y-20 my-8">
        {data.classes.map((classObj) => (
          <RenderClass
            className={cn("relative", styles.classContainer)}
            data={classObj}
            key={classObj.name}
          />
        ))}
      </ul>

      <p></p>
    </div>
  );
}
