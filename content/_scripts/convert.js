import dirs from "./dirs.js";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export function getOutputPath(inputPath) {
  const { dir, name } = path.parse(inputPath);
  return path.join('.docs/docs', `${name}.mdx`);
}

export function copyMdxFile(filePath) {
  if (!filePath.endsWith(".mdx")) {
    return;
  }

  const outputPath = getOutputPath(filePath);
  // make sure the output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.copyFileSync(filePath, outputPath);
  console.log(`📄 Copied: ${filePath} to ${outputPath}`);
}

export function copyAllMdxFiles(dirs) {
  const mdxFiles = [];
  for (const dir of dirs) {
    const mdxFilesInDir = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".mdx"));
    for (const mdxFile of mdxFilesInDir) {
      const mdxFilePath = path.join(dir, mdxFile);
      mdxFiles.push(mdxFilePath);
    }
  }

  console.log(`📄 Found ${mdxFiles.length} mdx files to copy.`);
  for (const mdxFile of mdxFiles) {
    copyMdxFile(mdxFile);
  }
}
