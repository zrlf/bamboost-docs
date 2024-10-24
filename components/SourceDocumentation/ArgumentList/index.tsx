import { Code } from "@/components/Code";
import { ArgumentObj } from "../types";
import { LinkAnnotation } from "../annotation";
import Markdown, { splitParagraph } from "@/components/Markdown/markdown";

export const Arguments = ({ data }: { data: ArgumentObj }) => {
  if (Object.keys(data).length === 0) {
    return null;
  }

  return Object.keys(data).length === 0 ||
    (Object.keys(data).length === 1 &&
      Object.keys(data)[0] === "self") ? null : (
    <div>
      <h5>Arguments</h5>
      <ul className="sm:ml-4 mt-0">
        {Object.entries(data).map(
          ([name, { annotation, description, default: defaultValue }]) =>
            name !== "self" && (
              <li key={name}>
                <Argument
                  name={name}
                  type={annotation!}
                  defaultValue={defaultValue}
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
    <div className="[&_p]:my-2">
      <div className="flex flex-wrap items-center">
        <h6>{name}</h6>
        <span className="mx-2">
          <LinkAnnotation children={type} />
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
      {description && <Markdown input={splitParagraph(description)} />}
    </div>
  );
};
