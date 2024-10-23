import { MethodObj, ReturnObj } from "@/components/SourceDocumentation/types";
import { Code } from "@/components/Code";
import MethodHeader from "./MethodHeader";
import Markdown from "@/components/Markdown/markdown";
import { Arguments } from "@/components/SourceDocumentation/ArgumentList";
import { LinkAnnotation } from "../annotation";

export const Method = ({
  data,
  clsName,
}: {
  data: MethodObj;
  clsName: string;
}) => {
  const code = <Code code={data.source.code} className="my-2" />;
  const signature = (
    <Code code={data.signature as string} inline noBackground />
  );
  const id = `${clsName}${data.name}`;
  const isClassMethod = data.props?.isClassMethod ? (
    <Code code="@classmethod" inline noBackground />
  ) : undefined;

  return (
    <>
      <MethodHeader
        name={data.name}
        clsName={clsName}
        signature={signature}
        code={code}
        id={id}
        isClassMethod={isClassMethod}
      />

      <div className="sm:ml-4">
        <Markdown input={data.docstring as string} />
        <Arguments data={data.arguments} />
        {data.returns &&
          (data.returns.annotation || data.returns.description) && (
            <Returns data={data.returns} />
          )}
        {data.examples.length > 0 && <Examples examples={data.examples} />}
      </div>
    </>
  );
};

const Returns = ({ data }: { data: ReturnObj }) => {
  return (
    <div>
      <h5>Returns</h5>
      <div className="ml-4">
        <LinkAnnotation children={data.annotation} />
        <span className="ml-2">{data.description}</span>
      </div>
    </div>
  );
};

const Examples = ({ examples }: { examples: string[] }) => {
  return (
    <div>
      <h5>Examples</h5>
      <div className="ml-4">
        {examples.map((example, i) => (
          <Code key={i} code={example} className="my-2 py-2 [&_*]:py-0" />
        ))}
      </div>
    </div>
  );
};

export const Constructor = ({
  data,
  clsName,
}: {
  data: MethodObj;
  clsName: string;
}) => {
  const code = <Code code={data.source.code} className="my-2" />;
  const signature = (
    <Code code={data.signature as string} inline noBackground />
  );

  return (
    <>
      <MethodHeader
        name={data.name}
        clsName={clsName}
        signature={signature}
        code={code}
        isConstructor
      />

      <div className="sm:ml-4">
        <Markdown input={data.docstring as string} />
        <Arguments data={data.arguments} />
        {data.examples && data.examples.length > 0 && (
          <Examples examples={data.examples} />
        )}
      </div>
    </>
  );
};
