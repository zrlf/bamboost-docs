import { docSource } from "@/lib/source";
import { autodocSources } from "@/lib/autodocSource";
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb";

export async function exportSearchIndexes() {
  const results: any[] = [];

  for (const page of docSource.getPages()) {
    const items = getBreadcrumbItems(page.url, docSource.getPageTree(), {
      includePage: false,
      includeRoot: true,
    });

    results.push({
      id: page.url,
      structuredData: page.data.structuredData,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      tag: "docs",
      breadcrumbs: items.flatMap<string>((item, i) =>
        i > 0 && typeof item.name === "string" ? item.name : [],
      ),
    });
  }

  for (const [sourceKey, source] of Object.entries(autodocSources)) {
    for (const page of source.getPages()) {
      const items = getBreadcrumbItems(page.url, source.getPageTree(), {
        includePage: false,
        includeRoot: true,
      });

      results.push({
        id: page.url,
        structuredData: page.data.structuredData,
        url: page.url,
        title: page.data.title,
        description: page.data.description,
        tag: `api-${sourceKey}`,
        breadcrumbs: items.flatMap<string>((item, i) =>
          i > 0 && typeof item.name === "string" ? item.name : [],
        ),
      });
    }
  }

  return results;
}
