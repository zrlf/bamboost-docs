import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { Module } from "@/fumapy/components/SourceDocumentation/module";
import { sources } from "@/fumapy/lib/source.api";
import Link from "next/link";
import { Braces } from "lucide-react";
import { Fragment } from "react";

export default function useApiPage() {
  return {
    Page: async function Page(props: { params: Promise<{ slug?: string[] }> }) {
      const params = await props.params;
      const source = Object.values(sources).find((source) => {
        return params.slug ? source.baseUrl === params.slug[0] : false;
      });
      if (!source) return notFound();
      const page = source.getPage(params.slug?.slice(1));
      if (!page) return notFound();

      const sourceUrl =
        source.gitUrl +
        "/" +
        (page.data.slug.at(-1) === "index" || page.data.slug.length === 0
          ? page.data.slug.slice(0, -1).join("/")
          : page.data.slug.join("/") + ".py");

      return (
        <DocsPage
          toc={page.data.toc}
          tableOfContent={{ style: "clerk", single: false }}
          breadcrumb={{ full: true, includeRoot: true }}
        >
          <DocsTitle>{page.data.data?.path || page.data.title}</DocsTitle>

          <div className="text-muted-foreground">
            Source:{" "}
            <a
              href={sourceUrl}
              target="_blank"
              className="underline text-primary/80 text-sm"
            >
              {sourceUrl}
            </a>
          </div>

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
