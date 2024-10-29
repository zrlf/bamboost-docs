import { Source } from "@/fumapy/lib/source.api";
import type { Metadata } from "next";
import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { Module } from "@/fumapy/components/SourceDocumentation/module";

export default function usePage(source: Source) {
  return {
    default: async function Page(props: { params: Promise<{ slug?: string[] }> }) {
      const params = await props.params;
      const page = source.getPage(params.slug);
      if (!page) notFound();

      return (
        <DocsPage
          toc={page.data.toc}
          tableOfContent={{ style: "clerk", single: false }}
          breadcrumb={{ full: true, includeRoot: true }}
        >
          <DocsTitle>{page.data.title}</DocsTitle>
          <DocsBody className="overflow-x-auto md:overflow-x-visible">
            <Module data={page.data.data!} />
          </DocsBody>
        </DocsPage>
      );
    },

    generateStaticParams: async function generateStaticParams() {
      return source.generateParams();
    },

    generateMetadata: async function generateMetadata(props: {
      params: Promise<{ slug?: string[] }>;
    }) {
      const params = await props.params;
      const page = source.getPage(params.slug);
      if (!page) notFound();

      return {
        title: page.data.title,
        description: page.data.description,
      } satisfies Metadata;
    },
  };
}
