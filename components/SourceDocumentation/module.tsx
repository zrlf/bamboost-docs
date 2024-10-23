import { Classes } from "./Classes";
import { Functions } from "./Function";
import { Attributes } from "./attributes";
import { ModuleObj } from "./types";
import fuma from "fumadocs-ui/mdx";

export const Module = ({ data }: { data: ModuleObj }) => {
  return (
    <div>
      <p>{data.docstring}</p>

      <fuma.h2 className="divider" id="attributes">
        Attributes
      </fuma.h2>
      <Attributes data={data.constants} />

      <fuma.h2 className="divider" id="functions">Functions</fuma.h2>
      <Functions data={data.functions} />

      <fuma.h2 className="divider" id="classes">Classes</fuma.h2>
      <Classes data={data.classes} />
    </div>
  );
};
