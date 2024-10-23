import Markdown from "../Markdown/markdown";
import { PropertyObj } from "./types";

export const Attributes = ({ data }: { data: PropertyObj[] }) => {

  return (
    <>
      <ul className="sm:ml-4 mt-0 [&_p]:my-2">
        {data.map((property) => (
          <li key={property.name}>
            <code>{property.name}</code>
            {property.description && <Markdown input={property.description} />}
          </li>
        ))}
      </ul>
    </>
  );
};
