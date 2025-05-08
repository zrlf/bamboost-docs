import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { quartoDirs } from "./dirs.js";

const inputDir = path.resolve(quartoDirs.inputDir);
const outputDir = path.resolve(quartoDirs.outputDir);

const competingExtensions = [".md", ".qmd", ".ipynb"];

function shouldCopy(filePath) {
  if (!filePath.endsWith(".mdx") && !filePath.endsWith(".json")) return false;

  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ".mdx");

  for (const ext of competingExtensions) {
    const sibling = path.join(dir, `${base}${ext}`);
    if (fs.existsSync(sibling)) return false;
  }

  return true;
}

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

function runCopy() {
  for (const filePath of walk(inputDir)) {
    if (!shouldCopy(filePath)) continue;

    const relativePath = path.relative(inputDir, filePath);
    const destPath = path.join(outputDir, relativePath);

    fs.copySync(filePath, destPath);
    console.log(`Copied: ${relativePath}`);
  }
}

runCopy();
