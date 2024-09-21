import React from "react";
import { ClassObj, GenericArgument } from "./types";
import { CodeBlock } from "@/components/Code";
import { RenderMethod } from "./Method";
import { getComponents } from "nextra-theme-docs";
import cn from "clsx";
import { classes, LinkAnnotation, Divider } from "./index";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./styles.module.css";
import { Markdown } from "./index";

export const ArgumentList = ({
  args,
  className,
}: {
  args: GenericArgument[];
  className?: string;
}) => {
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
              <div className="block md:inline-block text-gray-500">
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

const InheritedMembers = ({
  data: { cls, module, members },
  className,
  key,
}: {
  data: { cls: string; module: string; members: string[][] };
  className?: string;
  key?: string;
}) => {
  const [inheritedOpen, setInheritedOpen] = React.useState(false);

  return (
    <div className={className} key={key}>
      <button
        onClick={() => setInheritedOpen(!inheritedOpen)}
        className="flex items-center border rounded border-gray-700 px-1"
      >
        {`${cls}`} | {members.length} members
        <motion.svg
          animate={{ rotate: inheritedOpen ? 360 : 270 }}
          transition={{ duration: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-current"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {/* Chevron Down Icon */}
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {inheritedOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.1 }}
            className="space-y-2 mt-2"
          >
            <ul className={cn(classes.ul)}>
              {members.map(([type, name], index) => (
                <li key={index}>
                  <LinkAnnotation>
                    {`${module}.${cls}.${name}` +
                      (type == "function" ? "()" : "")}
                  </LinkAnnotation>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function SegmentTitle({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-highlight font-bold px-2", className)}>
      {children}
    </div>
  );
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
          "relative ml-5 md:ml-10 my-4 flex flex-col gap-5",
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

        {Object.keys(data.inherits_from).length > 0 && (
          <>
            <Divider />
            <SegmentTitle className="relative">Inherits</SegmentTitle>
            {Object.entries(data.inherits_from).map(
              ([cls, { module, members }]) => (
                <InheritedMembers key={cls} data={{ cls, module, members }} />
              ),
            )}
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
