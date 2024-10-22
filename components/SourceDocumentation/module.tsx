import { Code } from "../Code";
import { Classes } from "./Classes";
import { Function } from "./Function";
import { Properties } from "./properties";
import { MethodObj, ModuleObj } from "./types";

export const Module = ({ data }: { data: ModuleObj }) => {
  return (
    <div>
      <p>{data.docstring}</p>
      <Properties data={data.constants} />
      <Functions data={data.functions} />
      <Classes data={data.classes} />
    </div>
  );
};

export const Functions = ({ data }: { data?: MethodObj[] }) => {
  if (!data) return null;

  return (
    <div>
      {data.map((method) => {
        return (
          <Function
            key={method.name}
            data={method}
          />
        );
      })}
    </div>
  );
};
