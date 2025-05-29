#!/usr/bin/env bash

set -euo pipefail

# --- Usage check ---
if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <input_dir> <output_dir>"
  exit 1
fi

INPUT_DIR="$(realpath "$1")"
OUTPUT_DIR="$(realpath "$2")"

# --- Competing extensions ---
declare -a COMPETING_EXTS=(".md" ".qmd" ".ipynb")

# --- Function to check if a file should be copied ---
should_copy() {
  local file="$1"
  [[ "$file" != *.mdx && "$file" != *.json ]] && return 1

  local dir base sibling
  dir="$(dirname "$file")"
  base="$(basename "$file" .mdx)"

  for ext in "${COMPETING_EXTS[@]}"; do
    sibling="$dir/$base$ext"
    [[ -f "$sibling" ]] && return 1
  done

  return 0
}

# --- Walk and copy ---
find "$INPUT_DIR" -type f | while read -r file; do
  if should_copy "$file"; then
    relative_path="${file#$INPUT_DIR/}"
    dest_path="$OUTPUT_DIR/$relative_path"
    mkdir -p "$(dirname "$dest_path")"
    cp "$file" "$dest_path"
    echo "Copied: $relative_path"
  fi
done
