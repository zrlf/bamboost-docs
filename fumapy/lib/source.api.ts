import { loader } from "fumadocs-core/source";
import config from "@/fumapy.config";
import { getAllSlugs } from "./utils";
import { createAPISource } from "./createApiSource";
import { ModuleInterface } from "../components/SourceDocumentation/types";

const sources = Object.fromEntries(
  Object.entries(config.sources).map(([key, source]) => {
    // const data = source.sourceFile;
    const data: ModuleInterface = require(`../${source.pkgName}.json`);

    const newSource = {
      ...loader({
        baseUrl: source.baseUrl,
        source: createAPISource(data),
      }),
      allSlugs: getAllSlugs(data),
      baseUrl: source.baseUrl,
      pkgName: data.name,
      version: data.version,
      options: source.options,
    };

    return [key, newSource];
  }),
);

export type Source = (typeof sources)[keyof typeof sources];

export { sources };
