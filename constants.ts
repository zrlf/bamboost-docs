// Description: Constants used in the application
import sourceDoc from "@/extract-docs/data/source_docs.json";
import { getAllSlugs } from "./scripts/utils";

export const API_PATH: string = "/apidocs";
export const ALL_MODULES: string[][] = getAllSlugs(sourceDoc);
export const PKG_NAME: string = "bamboost";
