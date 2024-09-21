import React from "react";
import { ClassObj, GenericArgument } from "./types";
import { CodeBlock } from "@/components/Code";
import { RenderMethod } from "./Method";
import { getComponents } from "nextra-theme-docs";
import cn from "clsx";
import { classes, LinkAnnotation, Divider } from "./index";

import styles from "./styles.module.css";
import { Markdown } from "./index";

export const ArgumentList = ({ args, className }: { args: GenericArgument[], className?: string }) => {
  return (
    <ul className={cn(classes.ul, className)}>
      {Object.values(args).map((arg) => (
        <li key={arg.name} className="space-y-2">
          <div className="space-x-2">
            <div className={cn(classes.hl, "inline-block")}>{arg.name}</div>
            {arg.annotation && (
              <div className="inline-block">
                <LinkAnnotation>{arg.annotation}</LinkAnnotation>
              </div>
            )}
            {arg.default && (
              <div className="inline-block text-gray-500">
                Default: {arg.default}
              </div>
            )}
          </div>
          <Markdown>{arg.description}</Markdown>
        </li>
      ))}
    </ul>
  );
};

export function SegmentTitle({ children, className }: { children: string, className?: string }) {
  return <div className={cn("bg-highlight font-bold px-2", className)}>{children}</div>;
}

export function RenderClass({
  data,
  className,
  ...props
}: {
  data: ClassObj;
  className?: string | any;
}) {
  const components = getComponents({ isRawLayout: false });
  const classHeader = (
    <components.h2 id={data.name}>
      <span className={cn(classes.prefix, "mr-3 italic")}>class</span>
      {data.name}
      <span className={classes.signatureInline}>
        ( {Object.keys(data.constructor.arguments).join(", ")} )
      </span>
    </components.h2>
  );
  return (
    <div className={className} {...props}>
      {classHeader}
      <CodeBlock
        language="python"
        code={data.constructor.signature}
        className="mt-5"
      />
      <div
        className={cn(
          "relative overflow-x-clip ml-10 my-4 flex flex-col gap-5",
          styles.classContent,
        )}
      >
        <Markdown>{data.docstring}</Markdown>

        {Object.keys(data.constructor.arguments).length > 0 && (
          <>
            <Divider />
            <SegmentTitle>Arguments</SegmentTitle>
            <ArgumentList
              args={Object.entries(data.constructor.arguments).map(
                ([key, value]) => ({ ...value, name: key }),
              )}
            />
          </>
        )}

        {data.properties.length > 0 && (
          <>
            <Divider />
            <SegmentTitle>Properties</SegmentTitle>
            <ArgumentList args={data.properties} />
          </>
        )}

        {data.examples.length > 0 && (
          <>
            <Divider />
            <div className="space-y-2">
              <SegmentTitle>Examples</SegmentTitle>
              <ul className="space-y-2 ml-5">
                {data.examples.map((example, idx) => (
                  <li key={idx}>
                    <CodeBlock language="python" code={example} />
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <ul className="space-y-14">
          {Object.values(data.methods).map((method) => (
            <RenderMethod
              key={method.name}
              parentClass={data.name}
              data={method}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
