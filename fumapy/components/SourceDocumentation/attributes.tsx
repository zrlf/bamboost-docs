import { Code } from "../Code";
import Markdown from "../Markdown/markdown";
import { LinkAnnotation } from "./annotation";
import { AttributeInterface } from "./types";

export const Attributes = ({
  data,
  parent,
}: {
  data: AttributeInterface[];
  parent?: string;
}) => {
  return (
    <div className="[&_p]:my-2">
      <ul className="sm:ml-indent2 mt-0 [&_p]:my-2">
        {data.map((property) => (
          <li
            key={property.name}
            id={parent ? `${parent}.${property.name}` : property.name}
            // this is to make the anchor links shifted down by 20
            className="before:content-[''] before:block before:h-32 before:-mt-32 before:invisible"
          >
            <div className="flex flex-wrap items-center">
              <h6 className="font-mono">{property.name}</h6>
              {property.annotation && (
                <span className="ml-2">
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
            {property.description && <Markdown input={property.description} />}
          </li>
        ))}
      </ul>
    </div>
  );
};
