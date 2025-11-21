import { notFound } from "next/navigation";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { blog } from "@/lib/source";
import Image from "next/image";
import path from "node:path";

export default async function Page(props: PageProps<"/blog/[slug]">) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;
  const toc = page.data.toc;

  return (
    <article className="flex flex-col mx-auto w-full max-w-[800px] px-4 py-8">
      <div className="flex flex-row gap-4 text-sm mb-8">
        <div>
          <p className="mb-1 text-fd-muted-foreground">Written by</p>
          <p className="font-medium">{page.data.author}</p>
        </div>
        <div>
          <p className="mb-1 text-sm text-fd-muted-foreground">At</p>
          <p className="font-medium">
            {new Date(
              page.data.date ??
                path.basename(page.path, path.extname(page.path)),
            ).toDateString()}
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-semibold mb-4">{page.data.title}</h1>
      <p className="text-fd-muted-foreground mb-8">{page.data.description}</p>

      <div className="prose min-w-0 flex-1">
        <InlineTOC items={toc} />
        <Mdx components={{ ...defaultMdxComponents, Image }} />
      </div>
    </article>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
