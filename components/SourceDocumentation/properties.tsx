import { PropertyObj } from "./types";

export const Properties = ({ data }: { data?: PropertyObj[] }) => {
  if (!data) return null;

  return (
    <ul>
      {data.map((property) => (
        <li key={property.name}>
          <code>{property.name}</code>
          {/* <Markdown>{property.description}</Markdown> */}
        </li>
      ))}
    </ul>
  );
};
