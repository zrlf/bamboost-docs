import dirs from "./dirs.js";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CONVERTER = path.resolve("nb2mdx/nb2mdx.ts");

export function getOutputPath(inputPath) {
  const { dir, name } = path.parse(inputPath);
  return path.join(dir, `${name}.mdx`);
}

export function convertNotebook(filePath) {
  if (!filePath.endsWith(".ipynb")) {
    return;
  }
  console.log(`📘 Notebook changed: ${filePath}`);
  const proc = spawn("node", [CONVERTER, filePath, getOutputPath(filePath)], {
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

// loop through dirs and convert all notebooks
export function convertAllNotebooks(dirs) {
  const notebooks = [];
  for (const dir of dirs) {
    const notebookFiles = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".ipynb"));
    for (const notebook of notebookFiles) {
      const notebookPath = path.join(dir, notebook);
      notebooks.push(notebookPath);
    }
  }

  console.log(`📘 Found ${notebooks.length} notebooks to convert.`);
  for (const notebook of notebooks) {
    convertNotebook(notebook);
  }
}
