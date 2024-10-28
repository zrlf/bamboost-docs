import { getAllSlugs } from "./lib/utils";
import data from "@/api.json";

// Description: Constants used in the application
export const API_PATH: string = "/apidocs";
export const PKG_NAME: string = "bamboost";

// @ts-ignore
export const ALL_MODULES: string[][] = getAllSlugs(data);

export const shikiTheme = { dark: "everforest-dark", light: "github-light" };

export const excludeModules: string[] = ["bamboost._version"];
