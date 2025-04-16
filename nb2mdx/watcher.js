import chokidar from "chokidar";
import { convertNotebook } from "./index.js";
import dirs from "./dirs.js";

console.log(`📁 Watching directories: ${dirs}`);

const watcher = chokidar.watch(dirs, {
  ignoreInitial: true,
});
// const watcher = chokidar.watch(`${DOCS_DIR}/**/*.ipynb`, {});
watcher.on("add", convertNotebook);
watcher.on("change", convertNotebook);

console.log("🔁 Watching notebooks...");
