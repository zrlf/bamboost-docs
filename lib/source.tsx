import { docs, meta } from "@/.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader, Source, VirtualFile } from "fumadocs-core/source";
import data from "@/bamboostAPIdoc.json";
import { ModuleObj } from "../components/SourceDocumentation/types";
import { TOCItemType } from "fumadocs-core/server";
import { StructuredData } from "fumadocs-core/mdx-plugins";
import { getStructuredData } from "./getStructuredData";
import { createElement } from "react";
import {icons} from "lucide-react";

interface Page {
  slug: string[];
  title: string;
  path: string;
  description?: string;
  structuredData: StructuredData;
  toc?: TOCItemType[];
  data?: ModuleObj;
}

const Separator = ({ title }: { title: string }) => {
  return (
    <div className="hidden sm:block">
      <div
        className="relative text-foreground font-semibold z-10 mt-4"
      >
        {title}
      </div>
      <div
        className="absolute inset-0 bg-background"
      ></div>
    </div>
  );
};

function createTOC(module: ModuleObj): TOCItemType[] {
  const headers: TOCItemType[] = [];

  if (module.attributes.length > 0) {
    headers.push({
      title: <Separator title="Attributes" />,
      depth: 2,
      url: "#attributes",
    });
  }

  if (module.functions.length > 0) {
    headers.push({
      title: <Separator title="Functions" />,
      depth: 2,
      url: "#functions",
    });
    module.functions.forEach((func) => {
      headers.push({ title: func.name, depth: 2, url: `#${func.name}` });
    });
  }

  if (module.classes.length > 0) {
    headers.push({
      title: <Separator title="Classes" />,
      depth: 2,
      url: "#classes",
    });
    module.classes.forEach((cls) => {
      headers.push({ title: cls.name, depth: 2, url: `#${cls.name}` });
      Object.keys(cls.methods).forEach((method) => {
        headers.push({ title: method, depth: 3, url: `#${cls.name}${method}` });
      });
    });
  }
  return headers;
}

export function createAPISource(): Source<{
  metaData: { title: string; pages: string[] };
  pageData: Page;
}> {
  const pages: Page[] = [];

  function traverse(currentData: ModuleObj, path: string[]) {
    if (path.length > 0 && currentData.name) {
      function handlePageNamedIndex(slugIn: string[]) {
        if (slugIn[slugIn.length - 1] === "index") {
          return [...slugIn.slice(0, -1), "index_"];
        } else {
          return currentData.submodules.length > 0
            ? [...slugIn, "index"]
            : slugIn;
        }
      }
      const slug = handlePageNamedIndex(path);
      pages.push({
        slug,
        title: currentData.name,
        path: slug.join("/"),
        description: currentData.docstring.split("\n\n")[0],
        toc: createTOC(currentData),
        structuredData: getStructuredData(currentData),
        data: currentData,
      });
    } else {
      // We're at the root __init__ module
      pages.push({
        slug: path,
        title: `bamboost @${currentData.version}`,
        path: path.join("/"),
        description: currentData.docstring,
        toc: createTOC(currentData),
        structuredData: getStructuredData(currentData),
        data: currentData,
      });
    }

    currentData.submodules.forEach((submodule) => {
      traverse(submodule, [...path, submodule.name]);
    });
  }

  // @ts-expect-error
  traverse(data, []);

  const files: VirtualFile[] = pages.map((page) => {
    return {
      path: page.path,
      type: "page",
      data: page,
    };
  });

  return {
    files,
  };
}

export const docSource = loader({
  baseUrl: "/docs",
  icon(icon) {
    if (!icon) {
      return
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons])
  },
  source: createMDXSource(docs, meta),
});

export const apiSource = loader({
  baseUrl: "/apidocs",
  source: createAPISource(),
});
