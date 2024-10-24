import { apiSource } from "@/lib/source";
import type { Metadata } from "next";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { Module } from "@/components/SourceDocumentation/module";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = apiSource.getPage(params.slug);
  if (!page) notFound();

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ style: "clerk", single: false }}
      breadcrumb={{ full: true, includeRoot: true }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <Module data={page.data.data!} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return apiSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = apiSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
