import { loader } from "fumadocs-core/source";
import config from "@/fumapy.config";
import { getAllSlugs } from "./utils";
import { createAPISource } from "./createApiSource";
import { ModuleInterface } from "../components/SourceDocumentation/types";

const sources = Object.fromEntries(
    Object.entries(config.sources).map(([key, source]) => {
        // const data = source.sourceFile;
        const data: ModuleInterface = require(`../${source.pkgName}.json`);

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

        const newSource = {
            ...loader({
                baseUrl: source.baseUrl,
                source: createAPISource(data),
            }),
            allSlugs: getAllSlugs(data),
            version: data.version,
            ...source,
        };

        return [key, newSource];
    }),
);

export type Source = (typeof sources)[keyof typeof sources];

export { sources };
