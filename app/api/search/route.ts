import { exportSearchIndexes } from "@/lib/export-search-indexes";
import { createSearchAPI } from "fumadocs-core/search/server";

const indexes = await exportSearchIndexes();

export const { GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: indexes,
});
