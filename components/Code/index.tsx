import { Fragment, useEffect, useState } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx, jsxs } from "react/jsx-runtime";
import cn from "clsx";
import { codeToHast, codeToHtml } from "shiki";

import CopyCodeButton from "./CopyButton";

import styles from "./styles.module.css";

export function CodeBlockHtml({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [codeSignature, setCodeSignature] = useState("");

  useEffect(() => {
    // Define an async function inside useEffect
    async function generateCodeSignature() {
      const html = await codeToHtml(code, {
        lang: language,
        themes: { light: "nord", dark: "nord" },
        structure: "classic",
      });
      setCodeSignature(html);
    }

    // Call the async function
    generateCodeSignature();
  }, [code]);
  return (
    <div className="overflow-x-auto">
      <div dangerouslySetInnerHTML={{ __html: codeSignature }}></div>
    </div>
  );
}

export function CodeBlock({
  code,
  language,
  prefix,
  className,
}: {
  code: string;
  language: string;
  prefix?: JSX.Element;
  className?: string;
}) {
  const [codeSignature, setCodeSignature] = useState(<></>);
  const [copyButtonVisible, setCopyButtonVisible] = useState(false);

  useEffect(() => {
    async function generateCodeSignature() {
      const codeWithPreservedBlanks = code.replace(/^\s*$/gm, " ").trimEnd();
      const out = await codeToHast(codeWithPreservedBlanks, {
        lang: language,
        themes: { light: "github-light", dark: "github-dark" },
      });
      const jsxout = toJsxRuntime(out, {
        Fragment,
        jsx,
        jsxs,
        components: {
          code: (props) => (
            <code
              className="overflow-x-auto py-2 px-0 bg-transparent"
              {...props}
            />
          ),
          pre: (props) => (
            <pre {...props} className={cn(styles.pre, "shiki p-2")} />
          ),
        },
      });
      setCodeSignature(jsxout);
    }

    generateCodeSignature();
  }, [code]);

  return (
    <div
      className={cn("relative overflow-hidden rounded", className)}
      onMouseEnter={() => setCopyButtonVisible(true)}
      onMouseLeave={() => setCopyButtonVisible(false)}
    >
      {prefix}
      {codeSignature}
      <CopyCodeButton code={code} isVisible={copyButtonVisible} />
    </div>
  );
}

export function CodeInline({
  code,
  language,
  prefix,
  ...props
}: {
  code: string;
  language: string;
  prefix?: JSX.Element;
  props?: any;
}) {
  const [codeElement, setCodeElement] = useState(<></>);

  useEffect(() => {
    async function generateCodeSignature() {
      const out = await codeToHast(code, {
        lang: language,
        themes: { light: "catppuccin-mocha", dark: "nord" },
        structure: "inline",
      });
      const jsxout = toJsxRuntime(out, {
        Fragment,
        jsx,
        jsxs,
        components: {},
      });
      setCodeElement(jsxout);
    }

    generateCodeSignature();
  }, [code]);

  return (
    <span className="bg-highlight py-0.5 px-1 rounded" {...props}>
      {prefix}
      <span className="font-mono">{codeElement}</span>
    </span>
  );
}
