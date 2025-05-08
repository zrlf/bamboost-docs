import chokidar from "chokidar";
import { copyMdxFile } from "./convert.js";
import dirs from "./dirs.js";

console.log(`📁 Watching directories: ${dirs}`);

const watcher = chokidar.watch(dirs, {
  ignoreInitial: true,
});
// const watcher = chokidar.watch(`${DOCS_DIR}/**/*.ipynb`, {});
watcher.on("add", copyMdxFile);
watcher.on("change", copyMdxFile);

console.log("🔁 Watching mdx files...");
