import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { Module } from "@/fumapy/components/SourceDocumentation/module";
import { sources } from "@/fumapy/lib/source.api";

export default function useApiPage() {
  return {
    Page: async function Page(props: {
      params: Promise<{ slug?: string[] }>;
    }) {
      const params = await props.params;
      const source = Object.values(sources).find((source) => {
        return params.slug ? source.baseUrl === params.slug[0] : false;
      });
      if (!source) return notFound();
      const page = source.getPage(params.slug?.slice(1));
      if (!page) return notFound();

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
      const res = Object.values(sources).flatMap((source) =>
        source
          .generateParams()
          .map(({ slug }) => ({ slug: [source.baseUrl, ...slug] })),
      );
      return res;
    },

    generateMetadata: async function generateMetadata(props: {
      params: Promise<{ slug?: string[] }>;
    }) {
      const params = await props.params;
      const source = Object.values(sources).find((source) => {
        return params.slug ? source.baseUrl === params.slug[0] : false;
      });
      const page = source?.getPage(params.slug);

      return {
        title: page?.data.title,
        description: page?.data.description,
      } satisfies Metadata;
    },
  };
}
