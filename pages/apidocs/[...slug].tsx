import Layout from "@/components/NextraLayout";
import sourceDoc from "@/extract-docs/data/source_docs.json";
import Error from "next/error";
import { RenderModule } from "@/components/SourceDocumentation/Module";
import { ModuleObj } from "@/components/SourceDocumentation/types";
import { getAllSlugs, getSourceData } from "@/scripts/utils";


export default function Page({ slug, data }) {
  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <Layout slug={slug} data={data}>
      <RenderModule data={data} />
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const slugs = getAllSlugs(sourceDoc);
  const paths = slugs.map((slugArray) => ({
    params: { slug: slugArray },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const data: ModuleObj = getSourceData(slug, sourceDoc);
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: params.slug,
      data,
    },
  };
};

