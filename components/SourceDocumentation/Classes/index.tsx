import { Constructor, Method } from "./method";
import { Attributes } from "@/components/SourceDocumentation/attributes";
import { ClassInterface } from "@/components/SourceDocumentation/types";
import fuma from "fumadocs-ui/mdx";
import { InheritedMembers } from "./inherited";
import Markdown from "@/components/Markdown/markdown";
import { Arguments } from "../ArgumentList";

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

      <Constructor data={data.functions["__init__"]} clsName={data.name} />

      {data.description && <Markdown input={data.description} />}

      {data.functions["__init__"]?.parameters && (
        <Arguments data={data.functions["__init__"].parameters} />
      )}

      {data.attributes.length > 0 && (
        <>
          <h5>Attributes</h5>
          <Attributes data={data.attributes} />
        </>
      )}

      <InheritedMembers data={data.inherited_members} />

      {Object.values(data.functions).map((func) => {
        if (!func) return null;
        if (func.name === "__init__") return null;
        return <Method data={func} clsName={data.name} key={func.name} />;
      })}
    </div>
  );
};
