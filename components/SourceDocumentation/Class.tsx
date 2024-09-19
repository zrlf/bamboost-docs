import React from "react";
import { ClassObj, PropertyObj } from "./types";
import { CodeBlock } from "@/components/Code";
import { RenderMethod } from "./Method";
import { getComponents } from "nextra-theme-docs";
import cn from "clsx";
import { classes, RenderMarkdownString, LinkAnnotation, Divider } from "./index";

import styles from "./styles.module.css";

const Properties = ({ properties }: { properties: PropertyObj[] }) => {
  return (
    <ul className={classes.ul}>
      {Object.values(properties).map((property) => (
        <li key={property.name} className="space-y-2">
          <div className="flex gap-3 h-7 items-center">
            <div className={classes.hl}>{property.name}</div>
            {property.annotation && (
              <>
                {/* <Divider orientation="vertical" /> */}
                <div>
                  <LinkAnnotation>{property.annotation}</LinkAnnotation>
                </div>
              </>
            )}
          </div>
          <p className="ml-5">{property.description}</p>
        </li>
      ))}
    </ul>
  );
};

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
          "relative ml-10 my-4 flex flex-col gap-5",
          styles.classContent,
        )}
      >
        <RenderMarkdownString>{data.docstring}</RenderMarkdownString>

        <Divider />
        <div className="text-lg font-bold">Arguments</div>
        <ul className={classes.ul}>
          {Object.entries(data.constructor.arguments).map(([name, arg]) => {
            if (name === "self") return null;
            return (
              <components.li key={name}>
                <div className="flex gap-3 h-7 items-center">
                  <div className={classes.hl}>{name}</div>
                  {arg.annotation && (
                    <div>
                      <LinkAnnotation>{arg.annotation}</LinkAnnotation>
                    </div>
                  )}
                </div>
                <p className="ml-5">{arg.description}</p>
              </components.li>
            );
          })}
        </ul>
        <Divider />
        <div className="text-lg font-bold">Properties</div>
        <Properties properties={data.properties} />

        <Divider />
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
