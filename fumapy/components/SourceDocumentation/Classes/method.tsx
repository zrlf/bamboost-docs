import { Code } from "@/fumapy/components/Code";
import { DocstringSections } from "@/fumapy/components/Markdown/DocstringSections";
import Markdown from "@/fumapy/components/Markdown/markdown";
import { Arguments } from "@/fumapy/components/SourceDocumentation/ArgumentList";
import { FunctionInterface } from "@/fumapy/components/SourceDocumentation/types";
import { cn } from "@/fumapy/lib/utils";
import { Returns } from "../Function";
import MethodHeader from "./MethodHeader";
import { Bases } from "./inherited";

export const Method = ({
  data,
  clsName,
}: {
  data: FunctionInterface;
  clsName: string;
}) => {
  const code = data.source ? <Code code={data.source} className="my-0" /> : null;
  const signature = (
    <Code
      code={data.signature as string}
      inline
      noBackground
      className="whitespace-pre-line text-wrap"
    />
  );
  const id = `${clsName}.${data.name}`;

  const header = (
    <div className="my-2">
      <a href={`#${id}`} className="not-prose scroll-mt-28" id={id}>
        {clsName && (
          <span
            className={cn("text-muted-foreground/80 text-base font-semibold")}
          >
            {clsName}
          </span>
        )}
        {clsName && data.name && (
          <span className="text-muted-foreground/80 mx-0.5">.</span>
        )}
        <span className="font-bold text-foreground">{data.name}</span>
      </a>

      <span className="leading-relaxed italic">{signature}</span>
    </div>
  );

  return (
    <div className="sm:border sm:rounded-xl sm:bg-fd-secondary p-0">
      <MethodHeader header={header} code={code} />
      {/**/}
      <div className="sm:bg-fd-background sm:rounded-xl sm:border-t sm:p-2">
        <div className="sm:ml-indent space-y-6 my-0">
          {data.description && <Markdown input={data.description} />}
          <Arguments data={data.parameters} />
          {data.returns &&
            (data.returns.annotation || data.returns.description) && (
              <Returns data={data.returns} />
            )}

          {data.docstring.length > 0 && (
            <>
              <DocstringSections sections={data.docstring} />
            </>
          )}
        </div>
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
    <Code code={data.source} className="my-0" />
  ) : null;
  const signature = (
    <Code
      className="whitespace-pre-wrap overflow-x-scroll"
      code={data?.signature}
      inline
      noBackground
    />
  );
  const id = data ? `${clsName}.${data.name}` : clsName;
  const header = (
    <div className="my-2">
      <a
        href={`#${id}`}
        className="not-prose text-muted-foreground font-bold"
        id={id}
      >
        {clsName}
      </a>

      <span className="leading-relaxed italic">{signature}</span>
    </div>
  );

  return (
    <div className="bg-fd-secondary border rounded-xl">
      <MethodHeader header={header} code={code} />
    </div>
  );
};
