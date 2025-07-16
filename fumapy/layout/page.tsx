import { Module } from "@/fumapy/components/SourceDocumentation/module";
import { sources } from "@/fumapy/lib/source.api";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const source = Object.values(sources).find((source) => {
    return params.slug ? source.baseUrl === params.slug[0] : false;
  });
  if (!source) return notFound();
  const page = source.fdSource.getPage(params.slug?.slice(1));
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
      breadcrumb={{ includeRoot: true, includePage: true }}
    >
      <DocsTitle className="w-full break-words text-2xl">
        {page.data.data?.path || page.data.title}
      </DocsTitle>

      <div className="text-muted-foreground">
        Source:{" "}
        <a
          href={sourceUrl}
          target="_blank"
          className="underline decoration-primary text-sm"
        >
          {sourceUrl}
        </a>
      </div>

      <DocsBody className="overflow-x-auto md:overflow-x-visible">
        <Module data={page.data.data!} />
      </DocsBody>
    </DocsPage>
  );
}

async function generateStaticParams() {
  const res = Object.values(sources).flatMap((source) =>
    source.fdSource
      .generateParams()
      .map(({ slug }) => ({ slug: [source.baseUrl, ...slug] })),
  );
  return res;
}

async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const source = Object.values(sources).find((source) => {
    return params.slug ? source.baseUrl === params.slug[0] : false;
  });
  const page = source?.fdSource?.getPage(params.slug);

  return {
    title: page?.data.title,
    description: page?.data.description,
  };
}

export { Page, generateStaticParams, generateMetadata };
