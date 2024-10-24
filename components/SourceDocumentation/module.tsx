import { Card, Cards } from "fumadocs-ui/components/card";
import Markdown from "../Markdown/markdown";
import { Classes } from "./Classes";
import { Functions } from "./Function";
import { Attributes } from "./attributes";
import { ModuleObj } from "./types";
import fuma from "fumadocs-ui/mdx";

export const Module = ({ data }: { data: ModuleObj }) => {
  let cards = null;
  if (data.submodules.length > 0) {
    cards = (
      <Cards>
        {data.submodules.map((module) => {
          const sanitizedSlug = module.slug
            .slice(1)
            .map((slug) => slug.replace("index", "index_"));
          return (
            <Card
              key={module.name}
              title={module.name}
              description={module.short_description}
              href={`/apidocs/${sanitizedSlug.join("/")}`}
            />
          );
        })}
      </Cards>
    );
  }
  return (
    <div>
      {data.docstring && <Markdown input={data.docstring} />}

      {data.version && (
        <p>
          This documentation is valid for version{" "}
          <code className="text-base">{data.version}</code>
        </p>
      )}

      {cards}

      {data.attributes.length > 0 && (
        <>
          <fuma.h2 className="divider" id="attributes">
            Attributes
          </fuma.h2>
          <Attributes data={data.attributes} />
        </>
      )}

      {data.functions.length > 0 && (
        <>
          <fuma.h2 className="divider" id="functions">
            Functions
          </fuma.h2>
          <Functions data={data.functions} />
        </>
      )}

      {data.classes.length > 0 && (
        <>
          <fuma.h2 className="divider" id="classes">
            Classes
          </fuma.h2>
          <Classes data={data.classes} />
        </>
      )}
    </div>
  );
};
