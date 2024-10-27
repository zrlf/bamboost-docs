import { Constructor, Method } from "./method";
import { Attributes } from "@/components/SourceDocumentation/attributes";
import { ClassInterface } from "@/components/SourceDocumentation/types";
import fuma from "fumadocs-ui/mdx";
import { InheritedMembers } from "./inherited";
import Markdown from "@/components/Markdown/markdown";

export const Classes = ({ data }: { data: ClassInterface[] }) => {
  return (
    <div>
      {data.map((cls) => (
        <Class key={cls.name} data={cls} />
      ))}
    </div>
  );
};

export const Class = ({ data }: { data: ClassInterface }) => {
  return (
    <div>
      <fuma.h2 id={data.name} className="class">
        {data.name}
      </fuma.h2>

      {data.description && <Markdown input={data.description} />}

      {data.attributes.length > 0 && (
        <>
          <fuma.h4>Attributes</fuma.h4>
          <Attributes data={data.attributes} />
        </>
      )}

      <Constructor data={data.functions['__init__']} clsName={data.name} />

      {/* <InheritedMembers data={data.inherits_from} /> */}

      {Object.values(data.methods).map((method) => {
        if (!method) return null;
        return <Method data={method} clsName={data.name} key={method.name} />;
      })}
    </div>
  );
};
