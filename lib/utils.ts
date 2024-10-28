import { ModuleInterface } from "@/components/SourceDocumentation/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retrieves all possible slugs from a nested structure.
 *
 * @param {ModuleInterface} data - The root module containing the nested data structure.
 * @returns {string[][]} An array of arrays, where each inner array represents a possible slug path.
 */
export function getAllSlugs(data: ModuleInterface): string[][] {
  const slugs: string[][] = [];

  function traverse(currentData: ModuleInterface, path: string[]) {
    if (path.length > 0 && currentData.name) {
      slugs.push(path);
    }
    if (Object.keys(currentData.modules).length > 0) {
      Object.values(currentData.modules).forEach((submodule) => {
        traverse(submodule, [...path, submodule.name]);
      });
    }
  }

  traverse(data, []);
  return slugs;
}
