import { docSource } from "@/lib/source";
import { sources } from "@/fumapy/lib/source.api";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: [
    ...docSource.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: "docs",
    })),
    ...Object.entries(sources).flatMap(([sourceKey, source]) =>
      source.getPages().map((page) => ({
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        id: page.url,
        structuredData: page.data.structuredData,
        tag: `api-${sourceKey}`,
      })),
    ),
  ],
});
