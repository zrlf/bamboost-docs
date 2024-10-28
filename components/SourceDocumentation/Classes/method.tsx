import {
  FunctionInterface,
  ReturnInterface,
} from "@/components/SourceDocumentation/types";
import { Code } from "@/components/Code";
import MethodHeader from "./MethodHeader";
import Markdown from "@/components/Markdown/markdown";
import { Arguments } from "@/components/SourceDocumentation/ArgumentList";
import { LinkAnnotation } from "../annotation";
import { DocstringSections } from "@/components/Markdown/DocstringSections";

export const Method = ({
  data,
  clsName,
}: {
  data: FunctionInterface;
  clsName: string;
}) => {
  const code = data.source ? (
    <Code code={data.source} className="my-2" />
  ) : null;
  const signature = (
    <Code
      code={data.signature as string}
      inline
      noBackground
      className="whitespace-pre-line text-wrap"
    />
  );
  const id = `${clsName}.${data.name}`;
  const isClassMethod = undefined;

  return (
    <div className="mt-14">
      <MethodHeader
        name={data.name}
        clsName={clsName}
        signature={signature}
        code={code}
        id={id}
        isClassMethod={isClassMethod}
      />

      <div className="sm:ml-indent space-y-6">
        {data.description && <Markdown input={data.description} />}
        <Arguments data={data.parameters} />
        {data.returns &&
          (data.returns.annotation || data.returns.description) && (
            <Returns data={data.returns} />
          )}

        {data.docstring.length > 0 && (
          <>
            {/* <div className="w-full h-px bg-border"></div> */}
            <DocstringSections sections={data.docstring} />
          </>
        )}
      </div>
    </div>
  );
};

const Returns = ({ data }: { data: ReturnInterface }) => {
  return (
    <div>
      <h5>Returns</h5>
      <div className="ml-indent2">
        <LinkAnnotation children={data.annotation} />
        <span className="ml-2">{data.description}</span>
      </div>
    </div>
  );
};

export const Constructor = ({
  data,
  clsName,
}: {
  data: FunctionInterface;
  clsName: string;
}) => {
  const code = data?.source ? (
    <Code code={data.source} className="my-2" />
  ) : null;
  const signature = (
    <Code
      className="whitespace-pre-wrap overflow-x-scroll"
      code={data?.signature}
      inline
      noBackground
    />
  );

  return (
    <div>
      <MethodHeader
        clsName={clsName}
        signature={signature}
        code={code}
        isConstructor
      />
    </div>
  );
};
