import { MethodObj, ArgumentObj } from "../types";
import FumaComponents from "fumadocs-ui/mdx";
import Markdown from "../../Markdown/markdown";
import { FunctionHeader } from "./FunctionHeader";
import { Code } from "../../Code";

export const Function = ({ data }: { data: MethodObj }) => {
  const sourceCode = <Code code={data.source.code} className="my-0" />;
  const signature = (
    <Code
      code={data.signature as string}
      inline
      noBackground
      className="[&_span]:!italic"
    />
  );

  return (
    <div>
      <FunctionHeader data={data} signature={signature} code={sourceCode} />
      <div className="sm:ml-4">
        <Markdown>{data.docstring as string}</Markdown>
        <Arguments data={data.arguments} />
      </div>
    </div>
  );
};

export const Arguments = ({ data }: { data: ArgumentObj }) => {
  if (Object.keys(data).length === 0) {
    return null;
  }

  return (
    <div>
      <FumaComponents.h4>Arguments</FumaComponents.h4>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Default</th>
            <th className="border p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(
            ([name, { annotation, description, default: defaultValue }]) => (
              <tr key={name}>
                <td className="border p-2 font-bold">{name}</td>
                <td className="border p-2">
                  <Code code={annotation!} inline />
                </td>
                <td className="border p-2">
                  <code>{defaultValue || "-"}</code>
                </td>
                <td className="border p-2">{description}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};
