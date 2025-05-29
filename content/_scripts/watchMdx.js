import chokidar from "chokidar";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { quartoDirs } from "./dirs.js";

const inputDir = path.resolve(quartoDirs.inputDir);
const outputDir = path.resolve(quartoDirs.outputDir);

const watcher = chokidar.watch(inputDir, {
  cwd: inputDir,
  ignored: (filePath, stats) => {
    if (
      stats?.isFile() &&
      (!filePath.endsWith(".mdx") && !filePath.endsWith(".json"))
    )
      return true;

    const dir = path.dirname(filePath);
    const base = path.basename(filePath, ".mdx");

    const competingExtensions = [".md", ".qmd", ".ipynb"];

    for (const ext of competingExtensions) {
      if (fs.existsSync(path.join(dir, `${base}${ext}`))) {
        return true;
      }
    }

    return false;
  },
  persistent: true,
});

export function copyFile(file) {
  const srcPath = path.join(inputDir, file);
  const destPath = path.join(outputDir, file);
  fs.copy(srcPath, destPath)
    .then(() => console.log(`Copied: ${file}`))
    .catch((err) => console.error(`Error copying ${file}:`, err));
}

watcher
  .on("add", copyFile)
  .on("change", copyFile)
  .on("unlink", (file) => {
    const destPath = path.join(outputDir, file);
    fs.remove(destPath)
      .then(() => console.log(`Deleted: ${file}`))
      .catch((err) => console.error(`Error deleting ${file}:`, err));
  });

console.log("📁 Watching for .mdx file changes...", inputDir, outputDir);
