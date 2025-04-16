import fs from "fs";
import crypto from "crypto";
import path from "path";
import AnsiToHtml from "ansi-to-html";

function wrapHtml(html: string[]) {
    const escaped = html.join("").replace(/`/g, "\\`");
    return `<div className="nboutput-html" dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />`;
}

const ansi = new AnsiToHtml();

function renderStreamAsHtml(textLines: string[]) {
    const raw = textLines.join("");
    const html = ansi.toHtml(raw);
    return `<div className="nboutput-terminal" dangerouslySetInnerHTML={{ __html: \`${html.replace(/`/g, "\\`")}\` }} />`;
}

const FIGURE_DIR = path.resolve("content/docs/.nbfigures");
fs.mkdirSync(FIGURE_DIR, { recursive: true });

function saveImageBase64(base64: any, altText: string): string {
    const hash = crypto.createHash("sha1").update(base64).digest("hex");
    const filename = `${hash}.png`;
    const filePath = path.join(FIGURE_DIR, filename);
    const altTextClean =
        altText.replace("<", "&lt;").replace(">", "&gt;") ?? "output";

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
    }

    return `\n![${altTextClean}](content/docs/.nbfigures/` + filename + ")\n";
}

function extractOutputs(outputs: any[]) {
    const parts = [];

    for (const output of outputs) {
        if (output.output_type === "stream") {
            parts.push(`\n\`\`\`\n${output.text}\n\`\`\``);
        } else if (
            ["display_data", "execute_result"].includes(output.output_type)
        ) {
            const data = output.data || {};
            if (data["text/html"]) {
                parts.push(wrapHtml(data["text/html"]));
            } else if (data["image/png"]) {
                const img_string = saveImageBase64(
                    data["image/png"],
                    data["text/plain"][0] ?? "",
                );
                parts.push(img_string);
            } else if (data["text/plain"]) {
                parts.push(`\n\`\`\`\n${data["text/plain"]}\n\`\`\``);
            }
        }
    }

    return parts.join("\n\n");
}

function convertNotebook(inputPath: string, outputPath: string) {
    const nb = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
    const lines = [];

    for (const cell of nb.cells) {
        if (["markdown", "raw"].includes(cell.cell_type)) {
            lines.push(cell.source.join(""));
        } else if (cell.cell_type === "code") {
            // if first line is a comment, parse it as the title
            const firstLine = cell.source[0].trim();
            let title = null;

            if (firstLine.startsWith("#")) {
                title = firstLine.replace(/^#+/, "").trim();
                cell.source.shift(); // remove the title line
            }
            lines.push(
                "```python " +
                (title ? `title="${title}"` : "") +
                "\n" +
                cell.source.join("") +
                "\n```",
            );
            if (cell.outputs?.length) {
                lines.push(
                    [
                        '<div className="nboutput">',
                        extractOutputs(cell.outputs),
                        "</div>",
                    ].join("\n"),
                );
            }
        }
    }

    fs.writeFileSync(outputPath, lines.join("\n\n"), "utf-8");
    console.log(`✅ Converted: ${outputPath}`);
}

// CLI
if (process.argv.length !== 4) {
    console.error("Usage: node convertNotebookToMdx.js input.ipynb output.mdx");
    process.exit(1);
}

const [input, output] = process.argv.slice(2);
convertNotebook(input, output);
