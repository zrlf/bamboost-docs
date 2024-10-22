import { Method } from "./method";
import { Properties } from "@/components/SourceDocumentation/properties";
import { ClassObj } from "@/components/SourceDocumentation/types";
import { cn } from "@/lib/utils";
import FumaComponents from "fumadocs-ui/mdx";
import { LinkAnnotation } from "../annotation";
import { InheritedMembers } from "./inherited";

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
      <FumaComponents.h2 id={data.name}>{data.name}</FumaComponents.h2>
      <p>{data.short_description}</p>
      {/* <Markdown>{data.docstring}</Markdown> */}
      <Properties data={data.properties} />

      <InheritedMembers data={data.inherits_from} />

      {Object.values(data.methods).map((method) => {
        if (!method) return null;
        return <Method data={method} clsName={data.name} key={method.name} />;
      })}
    </div>
  );
};

