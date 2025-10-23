import { NextResponse } from "next/server";
import { type OramaDocument } from "fumadocs-core/search/orama-cloud";
import { docSource } from "@/lib/source";
import { autodocSources } from "@/lib/autodocSource";

export const revalidate = false;

export function GET() {
    const results: OramaDocument[] = [];

    for (const page of docSource.getPages()) {
        results.push({
            id: page.url,
            structured: page.data.structuredData,
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
                structured: page.data.structuredData,
                url: page.url,
                title: page.data.title,
                description: page.data.description,
                tag: `api-${sourceKey}`,
            });
        }
    }

    return NextResponse.json(results);
}
