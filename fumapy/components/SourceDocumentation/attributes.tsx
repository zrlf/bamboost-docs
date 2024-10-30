import { cn } from "@/fumapy/lib/utils";
import { Code } from "../Code";
import Markdown from "../Markdown/markdown";
import { LinkAnnotation } from "./annotation";
import { AttributeInterface } from "./types";

export const Attributes = ({
  data,
  parent,
  noTitle = false,
}: {
  data: AttributeInterface[];
  parent?: string;
  noTitle?: boolean;
}) => {
  return (
    <div>
      {!noTitle && <h5>Attributes:</h5>}
      <ul className={cn("mt-0 [&_p]:my-2", noTitle ? "ml-0 px-0 list-none" : "ml-indent")}>
        {data.map((property) => (
          <li
            key={property.name}
            id={parent ? `${parent}.${property.name}` : property.name}
          >
            <div className="flex flex-wrap items-center">
              <span className="font-bold">{property.name}</span>
              {property.annotation && (
                <span className="ml-2">
                  <span className="font-bold mr-2">:</span>
                  <LinkAnnotation children={property.annotation} />
                </span>
              )}
              {property.value && (
                <>
                  <span className="ml-2">=</span>
                  <span className="ml-2">
                    <Code code={property.value} inline />
                  </span>
                </>
              )}
            </div>
            {property.description && (
              <div className="sm:ml-indent">
                <Markdown input={property.description} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
