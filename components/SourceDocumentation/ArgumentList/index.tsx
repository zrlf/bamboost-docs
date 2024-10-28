import { Code } from "@/components/Code";
import { ParameterInterface } from "../types";
import { LinkAnnotation } from "../annotation";
import Markdown from "@/components/Markdown/markdown";
import { DocstringSections } from "@/components/Markdown/DocstringSections";

export const Arguments = ({ data }: { data: ParameterInterface[] }) => {
  if (!data) return null;
  if (data.length === 0) {
    return null;
  }

  return data.length === 0 ||
    (data.length === 1 && data[0].name === "self") ? null : (
    <div>
      <h5>Arguments</h5>
      <ul className="ml-indent2 mt-0">
        {data.map(
          ({ name, annotation, description, value }) =>
            name !== "self" && (
              <li key={name}>
                <Argument
                  name={name}
                  type={annotation!}
                  defaultValue={value}
                  description={description}
                />
              </li>
            ),
        )}
      </ul>
    </div>
  );
};

const Argument = ({
  name,
  type,
  defaultValue,
  description,
}: {
  name: string;
  type: string;
  defaultValue: string | null;
  description: string | null;
}) => {
  return (
    <div className="[&_p:not(.not-prose)]:my-2">
      <div className="flex flex-wrap items-center">
        <h6 className="font-mono">{name}</h6>
        <span className="mx-2">
          <Code code={type} inline link />
        </span>
        {defaultValue && (
          <>
            <span>=</span>
            <span className="mx-2">
              <Code code={defaultValue} inline />
            </span>
          </>
        )}
      </div>
      {description &&
        (typeof description == "string" ? (
          <Markdown input={description} />
        ) : (
          <DocstringSections sections={description} />
        ))}
    </div>
  );
};
