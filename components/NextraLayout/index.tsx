import { DocsThemeConfig, useThemeConfig } from "nextra-theme-docs";
import type { PageOpts, PageMapItem, UseTOC, Heading } from "nextra";
import { DataProvider } from "nextra/hooks/use-data";
import { useMDXComponents } from "nextra/mdx";
import Layout from "nextra-theme-docs";

import config from "@/theme.config";
import sourceDoc from "@/extract-docs/data/source_docs.json";

import { ModuleObj } from "@/components/SourceDocumentation/types";
import { useEffect } from "react";
import { API_PATH } from "@/constants";

function getTOC(data: ModuleObj | undefined): Heading[] {
  if (!data || !data.classes) return [];
  const headings: Heading[] = [];

  if (data.constants?.length > 0) {
    headings.push({ depth: 2, value: "Constants", id: "constants" });
  }

  if (data.functions?.length > 0) {
    headings.push({ depth: 2, value: "Functions", id: "functions" });

    data.functions?.map((func) => {
      headings.push({ depth: 3, value: func.name, id: func.name });
    });
  }

  if (data.classes?.length > 0) {
    headings.push({ depth: 2, value: "Classes", id: "classes" });

    data.classes?.map((cls) => {
      headings.push({ depth: 3, value: cls.name, id: cls.name });
      Object.values(cls.methods).map((method) => {
        method.name &&
          headings.push({
          depth: 4,
          value: method.name,
          id: `${cls.name}.${method.name}`,
        });
      });
    });
  }

  return headings;
}

export default function ApiLayout({
  children,
  slug,
  data,
  ...props
}: {
  children: React.ReactNode;
  slug: string | string[] | undefined;
  data: ModuleObj | undefined;
}) {
  const themeConfig: DocsThemeConfig = { ...useThemeConfig(), ...config };

  const pageMap: PageMapItem[] = getPageMap(sourceDoc);
  const pageOpts: PageOpts = {
    filePath: "apidocs/[slug]",
    frontMatter: {
      title: slug?.at(-1),
      description: "api documentation",
      slug: slug,
      tags: ["api"],
    },
    pageMap: pageMap,
    title: slug?.toString().replace(",", "/") || "API",
  };

  // useEffect to manually insert two links in the navbar
  // TODO: find a better way to do this using nextra itself
  useEffect(() => {
    const navbar = document.querySelector("nav");
    const apiLink = document.createElement("a");
    apiLink.href = `${API_PATH}/manager`;
    apiLink.className =
      "_text-sm contrast-more:_text-gray-700 contrast-more:dark:_text-gray-100 max-md:_hidden _whitespace-nowrap _font-medium _subpixel-antialiased";
    apiLink.innerText = "API Docs";
    apiLink.ariaCurrent = "true";
    const docsLink = document.createElement("a");
    docsLink.href = "/docs/basics/getting_started";
    docsLink.className =
      "_text-sm contrast-more:_text-gray-700 contrast-more:dark:_text-gray-100 max-md:_hidden _whitespace-nowrap _text-gray-600 hover:_text-gray-800 dark:_text-gray-400 dark:hover:_text-gray-200";
    docsLink.innerText = "Docs";
    docsLink.ariaCurrent = "false";
    navbar.insertBefore(apiLink, navbar.querySelector(".nextra-search"));
    navbar.insertBefore(docsLink, apiLink);
  }, []);

  return (
    <Layout pageOpts={pageOpts} themeConfig={themeConfig} pageProps={props}>
      <DataProvider value={props}>
        <MDXWrapper useTOC={() => getTOC(data)}>{children}</MDXWrapper>
      </DataProvider>
    </Layout>
  );
}

function MDXWrapper({
  children,
  useTOC,
}: {
  children: React.ReactNode;
  useTOC: UseTOC;
}): React.ReactElement {
  const { wrapper } = useMDXComponents();
  return (
    <TOCWrapper useTOC={useTOC} wrapper={wrapper}>
      {children}
    </TOCWrapper>
  );
}

// Wrapper to avoid following errors:
// Uncaught Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
// and
// Warning: React has detected a change in the order of Hooks called by NextraMDXContent. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks
function TOCWrapper({
  children,
  useTOC,
  wrapper: Wrapper,
  ...props
}: {
  children: React.ReactNode;
  useTOC: UseTOC;
  wrapper?: any;
}): React.ReactElement {
  const toc = useTOC(props);
  return Wrapper ? <Wrapper toc={toc}>{children}</Wrapper> : (children as any);
}

function getPageMap(
  data: ModuleObj,
  previousRoute: string | null = null,
): PageMapItem[] {
  return data.submodules
    ? data.submodules.map((submodule) => ({
        name: submodule.name,
        route: previousRoute
          ? `${previousRoute}/${submodule.name}`
          : `/apidocs/${submodule.name}`,
        children:
          submodule.submodules.length > 0
            ? getPageMap(
                submodule,
                previousRoute
                  ? `${previousRoute}/${submodule.name}`
                  : `/apidocs/${submodule.name}`,
              )
            : undefined,
      }))
    : [];
}
