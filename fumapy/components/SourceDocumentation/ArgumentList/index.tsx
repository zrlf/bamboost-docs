import { Code } from "@/fumapy/components/Code";
import { DocstringSection, ParameterInterface } from "../types";
import Markdown from "@/fumapy/components/Markdown/markdown";
import { DocstringSections } from "@/fumapy/components/Markdown/DocstringSections";

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
  defaultValue: string | null | undefined;
  description: string | DocstringSection[] | null;
}) => {
  return (
    <div className="[&_p:not(.not-prose)]:my-2">
      <div className="flex flex-wrap items-center">
        <span className="font-bold">{name}</span>
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
      {description && (
        <div className="sm:ml-indent2">
          {typeof description == "string" ? (
            <Markdown input={description} />
          ) : (
            <DocstringSections sections={description} />
          )}
        </div>
      )}
    </div>
  );
};
