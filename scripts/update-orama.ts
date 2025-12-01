import * as fs from "node:fs/promises";
import { CloudManager } from "@oramacloud/client";

import { type OramaDocument } from "fumadocs-core/search/orama-cloud";

export interface OramaIndex {
  id: string;

  title: string;
  url: string;

  tag?: string;

  /**
   * The id of page, used for `group by`
   */
  page_id: string;

  /**
   * Heading content
   */
  section?: string;

  breadcrumbs?: string[];

  /**
   * Heading (anchor) id
   */
  section_id?: string;

  content: string;
}

function toIndex(page: OramaDocument): OramaIndex[] {
  let id = 0;
  const indexes: OramaIndex[] = [];
  const scannedHeadings = new Set<string>();

  function createIndex(
    section: string | undefined,
    sectionId: string | undefined,
    content: string,
  ): OramaIndex {
    return {
      id: `${page.id}-${(id++).toString()}`,
      title: page.title,
      url: page.url,
      // TODO: explicit declare enums
      page_id: page.id,
      tag: page.tag,
      section,
      section_id: sectionId,
      content,
      breadcrumbs: page.breadcrumbs,
      ...page.extra_data,
    };
  }

  if (page.description)
    indexes.push(createIndex(undefined, undefined, page.description));

  page.structured.contents.forEach((p) => {
    const heading = p.heading
      ? page.structured.headings.find((h) => p.heading === h.id)
      : null;

    const index = createIndex(heading?.content, heading?.id, p.content);

    if (heading && !scannedHeadings.has(heading.id)) {
      scannedHeadings.add(heading.id);

      indexes.push(createIndex(heading.content, heading.id, heading.content));
    }

    indexes.push(index);
  });

  return indexes;
}
async function _sync(orama: CloudManager, documents: OramaDocument[]) {
  const index = orama.index("luqz1wlpv08f0t86g44h4ljy");
  await index.empty();
  await index.insert(documents.flatMap(toIndex) as unknown[]);
  await index.deploy();
}

// the path of pre-rendered `static.json`, choose one according to your React framework
const filePath = {
  next: ".next/server/app/static.json.body",
}["next"];

async function main() {
  const orama = new CloudManager({
    api_key: process.env.ORAMA_PRIVATE_API_KEY!,
  });

  const content = await fs.readFile(filePath);
  const records = JSON.parse(content.toString()) as OramaDocument[];

  await _sync(orama, records);

  console.log(`search updated: ${records.length} records`);
}

void main();
