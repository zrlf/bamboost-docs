import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeBlock } from "../Code";
import cn from "clsx";
import type { MethodObj } from "./types";
import { getComponents } from "nextra-theme-docs";

import styles from "./styles.module.css";
import { classes, LinkAnnotation } from "./index";
import { Markdown } from "./index";
import { ArgumentList, SegmentTitle } from "./Class";

export const RenderMethod = ({
  data,
  parentClass,
  className,
}: {
  data: MethodObj;
  parentClass?: string;
  className?: string | any;
}) => {
  const [isSourceVisible, setIsSourceVisible] = useState(false);
  const components = getComponents({ isRawLayout: false });

  return (
    <components.li key={data.name} className={cn(className, "space-y-2")}>
      <div className="flex justify-between items-end">
        <components.h3
          id={`${parentClass ? parentClass + "." : ""}${data.name}`}
        >
          <span className={cn(parentClass && styles.methodTitle, "relative")}>
            {parentClass && (
              <span className={cn(classes.prefix)}>{parentClass} . </span>
            )}
            {data.name}
            <span className={cn(classes.signatureInline)}>
              ( {Object.keys(data.arguments).join(", ")} )
            </span>
          </span>
        </components.h3>
        <button
          onClick={() => setIsSourceVisible(!isSourceVisible)}
          className="ml-2 text-xs flex items-center text-gray-500 px-2 border rounded border-gray-500 border-opacity-20 focus:outline-none"
        >
          source code
          <motion.svg
            animate={{ rotate: isSourceVisible ? 180 : 0 }}
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
      </div>

      <CodeBlock language="python" code={data.signature} />

      <AnimatePresence initial={false}>
        {isSourceVisible && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="overflow-hidden"
          >
            <CodeBlock language="python" code={data.source.code} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("ml-5 space-y-5 pt-3")}>
        <Markdown>{data.docstring}</Markdown>

        {Object.keys(data.arguments).length > 0 && (
          <>
            <SegmentTitle>Arguments</SegmentTitle>
            <ArgumentList
              className="md:pl-5"
              args={Object.entries(data.arguments).map(([key, value]) => ({
                ...value,
                name: key,
              }))}
            />
          </>
        )}

        {data.returns && data.returns.annotation != "None" && (
          <div>
            <SegmentTitle className="mb-5">Returns</SegmentTitle>
            {data.returns.annotation && (
              <div className="md:pl-5">
                <LinkAnnotation>{data.returns.annotation}</LinkAnnotation>
              </div>
            )}
            <div className="md:pl-5">{data.returns.description}</div>
          </div>
        )}

        {data.examples.length > 0 && (
          <div>
            <SegmentTitle className="mb-5">Examples</SegmentTitle>
            <ul className="space-y-3 md:ml-5">
              {data.examples.map((example, idx) => (
                <li key={idx}>
                  <CodeBlock language="python" code={example} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </components.li>
  );
};
