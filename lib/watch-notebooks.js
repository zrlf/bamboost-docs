import chokidar from "chokidar";
import { spawn } from "child_process";
import path from "path";

const DOCS_DIR = path.resolve("content/docs");
console.log(`📁 Watching directory: ${DOCS_DIR}`);
const CONVERTER = path.resolve("lib/nb2mdx.py"); // or .py

const watcher = chokidar.watch(DOCS_DIR, {
  ignoreInitial: true,
});
// const watcher = chokidar.watch(`${DOCS_DIR}/**/*.ipynb`, {});
watcher.on("add", convertNotebook);
watcher.on("change", convertNotebook);

console.log("🔁 Watching notebooks...");

function getOutputPath(inputPath) {
  const { dir, name } = path.parse(inputPath);
  return path.join(dir, `${name}.mdx`);
}

function convertNotebook(filePath) {
  if (!filePath.endsWith(".ipynb")) {
    return;
  }
  console.log(`📘 Notebook changed: ${filePath}`);
  const proc = spawn("python", [CONVERTER, filePath, getOutputPath(filePath)], {
    stdio: "inherit",
  });

  proc.on("exit", (code) => {
    if (code === 0) {
      console.log(`✅ Converted: ${filePath}`);
    } else {
      console.error(`❌ Conversion failed: ${filePath}`);
    }
  });
}
