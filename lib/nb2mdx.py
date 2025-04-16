import base64
from pathlib import Path

import nbformat


def wrap_html(html_str):
    # Escape backticks and ensure proper JS string formatting
    html_str = html_str.replace("`", "\\`")
    return f'<div className="nboutput-container" dangerouslySetInnerHTML={{ {{ __html: `{html_str}` }} }} />'


def save_image(image_data, filename: str, path: Path):
    # Save the image data to a file
    path.mkdir(parents=False, exist_ok=True)
    with open(path / filename, "wb") as f:
        # Decode base64 string and write to file
        f.write(base64.b64decode(image_data))


def extract_outputs(outputs, output_parent: Path, nb_name: str):
    md_parts = []
    figure_path = output_parent.joinpath("nbfigures")

    for output in outputs:
        if output.output_type == "stream":
            md_parts.append(f"\n```text\n{output.text}\n```")
        elif output.output_type in {"execute_result", "display_data"}:
            data = output.get("data", {})
            if "text/html" in data:
                md_parts.append(wrap_html(data["text/html"]))
                continue
            if "image/png" in data:
                b64 = data["image/png"]
                filename = f"{nb_name}_img{len(md_parts)}.png"
                save_image(b64, filename, figure_path)
                md_parts.append(f"![{filename}](./nbfigures/{filename})")
                continue
            if "text/plain" in data:
                md_parts.append(f"\n```text\n{data['text/plain']}\n```")
    return "\n".join(md_parts)


def convert_ipynb_to_mdx(input_path, output_path):
    nb = nbformat.read(input_path, as_version=4)
    output_lines = []
    output_parent = Path(output_path).parent
    output_path = Path(output_path)

    for cell in nb.cells:
        if cell.cell_type == "raw":
            output_lines.append(cell.source)
        elif cell.cell_type == "markdown":
            output_lines.append(cell.source)
        elif cell.cell_type == "code":
            # check if first line is a comment
            title = ""
            if cell.source.startswith("#"):
                title, cell.source = cell.source.split("\n", 1)
                title = title.strip("#").strip()
            output_lines.append(
                f"```python{' title="{}"'.format(title) if title else ''}\n{cell.source}\n```"
            )
            if cell.outputs:
                output_lines.extend(
                    [
                        '<div className="nboutput">\n',
                        extract_outputs(cell.outputs, output_parent, output_path.stem),
                        "\n</div>",
                    ]
                )

    Path(output_path).write_text("\n\n".join(output_lines), encoding="utf-8")
    print(f"Converted: {input_path} → {output_path}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 3:
        print("Usage: python nb_to_mdx.py input.ipynb output.mdx")
    else:
        convert_ipynb_to_mdx(sys.argv[1], sys.argv[2])
