import { docSource } from "@/lib/source";
import { autodocSources } from "@/lib/autodocSource";

export async function exportSearchIndexes() {
  const results: any[] = [];

  for (const page of docSource.getPages()) {
    results.push({
      id: page.url,
      structuredData: page.data.structuredData,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      tag: "docs",
    });
  }

  for (const [sourceKey, source] of Object.entries(autodocSources)) {
    for (const page of source.getPages()) {
      results.push({
        id: page.url,
        structuredData: page.data.structuredData,
        url: page.url,
        title: page.data.title,
        description: page.data.description,
        tag: `api-${sourceKey}`,
      });
    }
  }

  return results;
}
