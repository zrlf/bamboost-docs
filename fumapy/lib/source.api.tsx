import { loader } from "fumadocs-core/source";
import config from "@/fumapy.config";
import { getAllSlugs } from "./utils";
import { createAPISource } from "./createApiSource";
import { ModuleInterface } from "../components/SourceDocumentation/types";
import { PageTree } from "fumadocs-core/server";

function getPageTree(data: ModuleInterface, baseUrl: string): PageTree.Root {
  function build(
    currentData: ModuleInterface,
    parentPath: string[],
  ): PageTree.Node {
    const currentPath = [...parentPath, currentData.name];
    if (Object.keys(currentData.modules).length > 0) {
      return {
        type: "folder",
        name: currentData.name,
        index: {
          type: "page",
          name: currentData.name,
          url: `/${baseUrl}/${currentPath.join("/")}`,
        },
        children: [
          ...Object.values(currentData.modules).map((submodule) =>
            build(submodule, currentPath),
          ),
        ],
      };
    } else {
      return {
        type: "page",
        name: currentData.name,
        url: `/${baseUrl}/${currentPath.join("/")}`,
      };
    }
  }

  const main: PageTree.Node[] = [
    {
      type: "separator",
      name: (
        <span className="font-semibold">
          Version:{" "}
          <code className="bg-muted p-1 rounded-sm border">
            {data.version
              ?.replaceAll("'", "")
              .split(".", 3)
              .slice(0, 3)
              .join(".")}
          </code>
        </span>
      ),
    },
    {
      type: "page",
      name: data.name,
      url: `/${baseUrl}`,
    },
    {
      type: "separator",
      name: <span className="font-semibold">Modules</span>,
    },
  ];

  const children = [
    ...main,
    ...Object.values(data.modules).map((submodule) => build(submodule, [])),
  ];

  return { name: baseUrl, children } as PageTree.Root;
}

const sources = Object.fromEntries(
  Object.entries(config.sources).map(([key, source]) => {
    // const data = source.sourceFile;
    const data: ModuleInterface = require(`./${source.pkgName}.json`);

    // Recursive function to find and sort the methods of a class
    // @ts-ignore
    const transformClasses = (obj: any) => {
      if (Array.isArray(obj)) {
        return obj.map(transformClasses);
      } else if (typeof obj === "object" && obj !== null) {
        if (obj.functions) {
          // Sort the members of the class (assuming members is an array)
          obj.functions = Object.fromEntries(
            Object.entries(obj.functions).sort(([, a], [, b]) => {
              // @ts-ignore
              if (a.name.startsWith("__")) return -1;
              // @ts-ignore
              if (b.name.startsWith("__")) return 1;
              // @ts-ignore
              if (a.name.startsWith("_")) return 1;
              // @ts-ignore
              if (b.name.startsWith("_")) return -1;
              return 0;
            }),
          );
        }
        return Object.fromEntries(
          // @ts-ignore
          Object.entries(obj).map(([key, value]) => [
            key,
            transformClasses(value),
          ]),
        );
      }
      return obj;
    };

    // Apply the transformation to the entire data structure
    if (source.sortClassMethods) {
      transformClasses(data);
    }

    const fdSource = loader({
      baseUrl: source.baseUrl,
      source: createAPISource(data),
    });

    const newSource = {
      fdSource,
      allSlugs: getAllSlugs(data),
      version: data.version,
      ...source,
    };
    newSource.fdSource.pageTree = getPageTree(data, source.baseUrl);

    return [key, newSource];
  }),
);

export type Source = (typeof sources)[keyof typeof sources];

export { sources };
