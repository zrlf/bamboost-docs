import {
  FunctionInterface,
  ReturnInterface,
} from "@/fumapy/components/SourceDocumentation/types";
import { Code } from "@/fumapy/components/Code";
import MethodHeader from "./MethodHeader";
import Markdown from "@/fumapy/components/Markdown/markdown";
import { Arguments } from "@/fumapy/components/SourceDocumentation/ArgumentList";
import { LinkAnnotation } from "../annotation";
import { DocstringSections } from "@/fumapy/components/Markdown/DocstringSections";
import { Returns } from "../Function";

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
    <div className="">
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
