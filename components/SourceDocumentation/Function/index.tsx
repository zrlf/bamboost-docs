import { MethodObj, ReturnObj } from "../types";
import Markdown, { splitParagraph } from "../../Markdown/markdown";
import { FunctionHeader } from "./FunctionHeader";
import { Code } from "../../Code";
import { Arguments } from "../ArgumentList";
import { LinkAnnotation } from "../annotation";

export const Functions = ({ data }: { data: MethodObj[] }) => {
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
      {data.returns && data.returns.annotation !== "None" && (
        <Returns data={data.returns} />
      )}
    </div>
  );
};

const Returns = ({ data }: { data: ReturnObj }) => {
  return (
    <div>
      <h5>Returns</h5>
      <div className="ml-4">
        <LinkAnnotation children={data.annotation!} />
        <span className="ml-2">{data.description}</span>
      </div>
    </div>
  );
};
