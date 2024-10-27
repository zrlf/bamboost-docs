import { FunctionInterface, ReturnInterface, ModuleInterface } from "../types";
import Markdown, { splitParagraph } from "../../Markdown/markdown";
import { FunctionHeader } from "./FunctionHeader";
import { Code } from "../../Code";
import { Arguments } from "../ArgumentList";
import { LinkAnnotation } from "../annotation";

export const Functions = ({ data }: { data: FunctionInterface[] }) => {
  return (
    <div>
      {data.map((func) => {
        return <Function key={func.name} data={func} />;
      })}
    </div>
  );
};

export const Function = ({ data }: { data: FunctionInterface }) => {
  const sourceCode = <Code code={data.source} className="my-2" />;
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
      <div className="sm:ml-indent">
        {data.description && <Markdown input={data.description} />}
        <Arguments data={data.parameters} />
        {data.returns &&
          (data.returns.annotation || data.returns.description) && (
            <Returns data={data.returns} />
          )}
      </div>
    </div>
  );
};

const Returns = ({ data }: { data: ReturnInterface }) => {
  return (
    <div>
      <h5>Returns</h5>
      <div className="ml-indent">
        <LinkAnnotation children={data.annotation} />
        <span className="ml-2">{data.description}</span>
      </div>
    </div>
  );
};
