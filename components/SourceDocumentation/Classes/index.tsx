import { Method } from "./method";
import { Attributes } from "@/components/SourceDocumentation/attributes";
import { ClassObj } from "@/components/SourceDocumentation/types";
import fuma from "fumadocs-ui/mdx";
import { InheritedMembers } from "./inherited";
import Markdown from "@/components/Markdown/markdown";

export const Classes = ({ data }: { data: ClassObj[] }) => {
  return (
    <div>
      {data.map((cls) => (
        <Class key={cls.name} data={cls} />
      ))}
    </div>
  );
};

export const Class = ({ data }: { data: ClassObj }) => {
  return (
    <div>
      <fuma.h2 id={data.name} className="class">
        {data.name}
      </fuma.h2>
      <Markdown input={data.docstring} />
      <Attributes data={data.properties} />
      <InheritedMembers data={data.inherits_from} />

      {Object.values(data.methods).map((method) => {
        if (!method) return null;
        return <Method data={method} clsName={data.name} key={method.name} />;
      })}
    </div>
  );
};
