import { Card, Cards } from "fumadocs-ui/components/card";
import Markdown from "../Markdown/markdown";
import { Classes } from "./Classes";
import { Functions } from "./Function";
import { Attributes } from "./attributes";
import { ModuleInterface } from "./types";
import fuma from "fumadocs-ui/mdx";
import { DocstringSections } from "../Markdown/DocstringSections";
import { sources } from "@/fumapy/lib/source.api";
import config from "@/fumapy.config";

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
            .map((slug) => slug.replace("index", "index_"));
          return (
            <Card
              key={module.name}
              title={module.name}
              description={module.description}
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

      {cards}

      {data.attributes.length > 0 && (
        <>
          <fuma.h2 className="divider" id="attributes">
            Attributes
          </fuma.h2>
          <Attributes data={data.attributes} />
        </>
      )}

      {Object.keys(data.functions).length > 0 && (
        <>
          <fuma.h2 className="divider" id="functions">
            Functions
          </fuma.h2>
          <Functions data={Object.values(data.functions)} />
        </>
      )}

      {Object.values(data.classes).length > 0 && (
        <>
          <fuma.h2 className="divider" id="classes">
            Classes
          </fuma.h2>
          <Classes data={Object.values(data.classes)} />
        </>
      )}
    </div>
  );
};
