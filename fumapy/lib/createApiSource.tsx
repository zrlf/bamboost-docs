import { Source, VirtualFile } from "fumadocs-core/source";
import { ModuleInterface } from "../components/SourceDocumentation/types";
import { TOCItemType } from "fumadocs-core/server";
import { StructuredData } from "fumadocs-core/mdx-plugins";
import { getStructuredData } from "./getStructuredData";
import config from "@/fumapy.config";

export interface Page {
  slug: string[];
  title: string;
  path: string;
  description?: string;
  structuredData: StructuredData;
  toc?: TOCItemType[];
  data?: ModuleInterface;
}

const Separator = ({ title }: { title: string }) => {
  return (
    <div>
      <div className="relative text-foreground font-semibold z-1 mt-0 xl:mt-4">
        {title}
      </div>
      <div className="hidden xl:block absolute inset-0 bg-background"></div>
    </div>
  );
};

function createTOC(module: ModuleInterface): TOCItemType[] {
  const headers: TOCItemType[] = [];

  if (module.attributes.length > 0) {
    headers.push({
      title: <Separator title="Attributes" />,
      depth: 2,
      url: "#attributes",
    });
  }

  if (Object.keys(module.functions).length > 0) {
    headers.push({
      title: <Separator title="Functions" />,
      depth: 2,
      url: "#functions",
    });
    Object.values(module.functions).forEach((func) => {
      headers.push({
        title: <div className="toc-func">{func.name}</div>,
        depth: 2,
        url: `#${func.name}`,
      });
    });
  }

  if (Object.keys(module.classes).length > 0) {
    headers.push({
      title: <Separator title="Classes" />,
      depth: 2,
      url: "#classes",
    });
    Object.values(module.classes).forEach((cls) => {
      headers.push({
        title: <div className="toc-class">{cls.name}</div>,
        depth: 2,
        url: `#${cls.name}`,
      });
      Object.keys(cls.functions).forEach((method) => {
        if (method === "__init__") return;
        headers.push({
          title: <div className="toc-meth">{method}</div>,
          depth: 3,
          url: `#${cls.name}.${method}`,
        });
      });
    });
  }
  return headers;
}

export function createAPISource(data: any): Source<{
  metaData: { title: string; pages: string[] };
  pageData: Page;
}> {
  const pages: Page[] = [];

  function traverse(currentData: ModuleInterface, path: string[]) {
    if (path.length > 0 && currentData.name) {
      function addPage(currentData: ModuleInterface, path: string[]) {
        const slug = path;
        pages.push({
          slug,
          title: currentData.name,
          path: slug.join("/"),
          description: currentData.description?.split("\n\n")[0],
          toc: createTOC(currentData),
          structuredData: getStructuredData(currentData),
          data: currentData,
        });
      }
      if (!config.excludeModules.includes(currentData.path))
        addPage(currentData, path);
    } else {
      // We're at the root __init__ module
      const version = `@${data.version}`;
      const title = currentData.name + version;

      pages.push({
        slug: path,
        title: title,
        path: path.join("/"),
        description: currentData.description || "",
        toc: createTOC(currentData),
        structuredData: getStructuredData(currentData),
        data: currentData,
      });
    }

    Object.values(currentData.modules)?.forEach((submodule) => {
      traverse(submodule, [...path, submodule.name]);
    });
  }

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
