import { ModuleObj } from "@src/components/SourceDocumentation/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retrieves all possible slugs from a nested structure.
 *
 * @param {ModuleObj} data - The root module containing the nested data structure.
 * @returns {string[][]} An array of arrays, where each inner array represents a possible slug path.
 */
function getAllSlugs(data: ModuleObj): string[][] {
  const slugs: string[][] = [];

  function traverse(currentData: ModuleObj, path: string[]) {
    if (path.length > 0 && currentData.name) {
      slugs.push(path);
    }
    if (currentData.submodules.length > 0) {
      currentData.submodules.forEach((submodule) => {
        traverse(submodule, [...path, submodule.name]);
      });
    }
  }

  traverse(data, []);
  return slugs;
}

/**
 * Retrieves data from a nested structure based on a given slug.
 *
 * @param {string | string[] | undefined} slug - The slug or array of slugs to navigate the nested structure.
 * @param {ModuleObj} data - The root module containing the nested data structure.
 * @returns {ModuleObj | undefined} The data corresponding to the provided slug, or undefined if not found.
 */
function getSourceData(
  slug: string | string[] | undefined,
  data: ModuleObj,
): ModuleObj | undefined {
  if (!slug || (Array.isArray(slug) && slug.length === 0)) {
    return data;
  }

  // Ensure 'slug' is always treated as an array
  const slugs = Array.isArray(slug) ? slug : [slug];

  const [firstElement, ...restOfSlugs] = slugs;

  const foundData = data?.submodules?.find((p) => p.name === firstElement);

  if (!foundData) {
    return undefined; // Return undefined if the submodule isn't found
  }

  // If there are no more slugs to process, return the found data
  if (restOfSlugs.length === 0) {
    return foundData;
  }

  // Recurse with the rest of the slugs
  return getSourceData(restOfSlugs, foundData);
}

export { getAllSlugs, getSourceData };
