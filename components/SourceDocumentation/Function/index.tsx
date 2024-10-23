import { MethodObj } from "../types";
import Markdown, { splitParagraph } from "../../Markdown/markdown";
import { FunctionHeader } from "./FunctionHeader";
import { Code } from "../../Code";
import { Arguments } from "../ArgumentList";

export const Functions = ({ data }: { data?: MethodObj[] }) => {
  if (!data) return null;

  return (
    <div>
      {data.map((method) => {
        return <Function key={method.name} data={method} />;
      })}
    </div>
  );
};

export const Function = ({ data }: { data: MethodObj }) => {
  const sourceCode = <Code code={data.source.code} className="my-2" />;
  const signature = (
    <Code
      code={data.signature as string}
      inline
      noBackground
      className="[&_span]:!italic text-base"
    />
  );

  return (
    <div>
      <FunctionHeader data={data} signature={signature} code={sourceCode} />
      <div className="sm:ml-4">
        {data.docstring && <Markdown input={splitParagraph(data.docstring)} />}
        <Arguments data={data.arguments} />
      </div>
    </div>
  );
};
