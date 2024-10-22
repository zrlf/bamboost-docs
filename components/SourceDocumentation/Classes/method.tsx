import FumaComponents from "fumadocs-ui/mdx";
import { MethodObj } from "@/components/SourceDocumentation/types";
import { Code } from "@/components/Code";
import MethodHeader from "./MethodHeader";
import Markdown from "@/components/Markdown/markdown";

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

      <Markdown>{data.docstring as string}</Markdown>
    </>
  );
};
