import { Constructor, Method } from "./method";
import { Attributes } from "@/components/SourceDocumentation/attributes";
import { ClassInterface } from "@/components/SourceDocumentation/types";
import fuma from "fumadocs-ui/mdx";
import { Bases } from "./inherited";
import Markdown from "@/components/Markdown/markdown";
import { Arguments } from "../ArgumentList";
import { DocstringSections } from "@/components/Markdown/DocstringSections";

export const Classes = ({ data }: { data: ClassInterface[] }) => {
  return (
    <div className="space-y-20">
      {data.map((cls) => (
        <Class key={cls.name} data={cls} />
      ))}
    </div>
  );
};

export const Class = ({ data }: { data: ClassInterface }) => {
  return (
    <div className="space-y-14">
      <div className="space-y-6">
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
            <Attributes data={data.attributes} parent={data.name}/>
          </>
        )}

        {data.docstring && <DocstringSections sections={data.docstring} />}

        {Object.keys(data.inherited_members).length > 0 && (
          <Bases data={data.inherited_members} />
        )}
      </div>

      <div className="space-y-14">
        {Object.values(data.functions).map((func) => {
          if (!func) return null;
          if (func.name === "__init__") return null;
          return <Method data={func} clsName={data.name} key={func.name} />;
        })}
      </div>
    </div>
  );
};
