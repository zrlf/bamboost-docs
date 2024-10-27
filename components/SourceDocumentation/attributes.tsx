import { Code } from "../Code";
import Markdown, { splitParagraph } from "../Markdown/markdown";
import { LinkAnnotation } from "./annotation";
import { AttributeInterface } from "./types";

export const Attributes = ({ data }: { data: AttributeInterface[] }) => {
  return (
    <div className="[&_p]:my-2">
      <ul className="sm:ml-indent2 mt-0 [&_p]:my-2">
        {data.map((property) => (
          <li key={property.name}>
            <div className="flex flex-wrap items-center">
              <h6>{property.name}</h6>
              {property.annotation && (
                <span className="ml-2">
                  <LinkAnnotation children={property.annotation} />
                </span>
              )}
              {property.default && (
                <>
                  <span className="ml-2">=</span>
                  <span className="ml-2">
                    <Code code={property.default} inline />
                  </span>
                </>
              )}
            </div>
            {property.description && (
              <Markdown input={splitParagraph(property.description)} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
