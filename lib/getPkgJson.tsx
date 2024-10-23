import fs from "fs";
import path from "path";
import { ModuleObj } from "@/components/SourceDocumentation/types";

export async function getPkgJson(): Promise<ModuleObj> {
  const filePath = path.join(process.cwd(), "bamboostAPIdoc.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}
