import { Method } from "./method";
import { Properties } from "@/components/SourceDocumentation/properties";
import { ClassObj } from "@/components/SourceDocumentation/types";
import FumaComponents from "fumadocs-ui/mdx";

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
      {Object.values(data.methods).map((method) => {
        if (!method) return null;
        return (
          <Method
            data={method}
            clsName={data.name}
            key={method.name}
          />
        );
      })}
    </div>
  );
};
