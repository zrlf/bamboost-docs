import config from "@/fumapy.config";
import { sources } from "@/fumapy/lib/source.api";
import { Card, Cards } from "fumadocs-ui/components/card";
import { TableOfContents } from "lucide-react";
import { DocstringSections } from "../Markdown/DocstringSections";
import Markdown from "../Markdown/markdown";
import { Classes } from "./Classes";
import { Functions } from "./Function";
import { Attributes } from "./attributes";
import { ModuleInterface } from "./types";

export const Module = ({ data }: { data: ModuleInterface }) => {
  let cards = null;

  if (Object.keys(data.modules).length > 0) {
    cards = (
      <Cards>
        {Object.values(data.modules).map((module) => {
          if (config.excludeModules.includes(module.path)) return null;
          const baseUrl = sources[module.path.split(".")[0]].baseUrl;
          const sanitizedSlug = module.path
            .split(".")
            .slice(1)
          return (
            <Card
              key={module.name}
              title={module.name}
              description={module.description?.split("\n\n")[0]}
              href={`/${baseUrl}/${sanitizedSlug.join("/")}`}
            />
          );
        })}
      </Cards>
    );
  }

  return (
    <div>
      {data.description && <Markdown input={data.description} />}

      {data.docstring && <DocstringSections sections={data.docstring} />}

      <div className="mt-indent">{cards}</div>

      {data.attributes.length > 0 && (
        <>
          <h2 className="divider" id="attributes">
            <TableOfContents />
            Attributes
          </h2>
          <Attributes data={data.attributes} noTitle />
        </>
      )}

      {Object.keys(data.functions).length > 0 && (
        <>
          <h2 className="divider" id="functions">
            <TableOfContents />
            Functions
          </h2>
          <Functions data={Object.values(data.functions)} />
        </>
      )}

      {Object.values(data.classes).length > 0 && (
        <>
          <h2 className="divider" id="classes">
            <TableOfContents />
            Classes
          </h2>
          <Classes data={Object.values(data.classes)} />
        </>
      )}
    </div>
  );
};
