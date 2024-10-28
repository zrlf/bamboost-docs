import React, { ComponentProps } from "react";
import { ALL_MODULES, API_PATH, PKG_NAME } from "@/constants";
import Link from "fumadocs-core/link";

export function LinkAnnotation({
  children,
  returnNull = false,
  ...props
}: {
  children: string | null;
  returnNull?: boolean;
} & ComponentProps<"code">) {
  if (!children) {
    return null;
  }

  const cleanedChildren = children.replace(/[^a-zA-Z0-9,._\[\]()= ]/g, "");

  // Remove any occurrence of class, func, etc.
  const filteredChildren = cleanedChildren
    .replace(/(class|func|method|module|object)/g, "")
    .trim();

  // Find the part of the string that starts with 'bamboost.'
  const match = filteredChildren.match(
    new RegExp(`${PKG_NAME}\\.[a-zA-Z0-9._]+`),
  );

  if (match) {
    const bamboostPart = match[0];
    const parsedElement = LinkifyPkg(bamboostPart, false);

    // Create the full element by combining the parsed part with the rest of the string
    const beforeMatch = filteredChildren.slice(0, match.index);
    const afterMatch = filteredChildren.slice(
      match.index! + bamboostPart.length,
    );

    return (
      <code {...props}>
        {beforeMatch}
        {parsedElement}
        {afterMatch}
      </code>
    );
  }

  if (returnNull) return null;

  return <code {...props}>{filteredChildren}</code>;
}

/**
 * Parses the input string to extract the slug and remainder based on ALL_SLUGS.
 * @param input - The input string to be parsed.
 * @returns A link or the original input string.
 */
export function LinkifyPkg(input: string, markdown: true): string;
export function LinkifyPkg(input: string, markdown?: false): React.ReactNode;
export function LinkifyPkg(
  input: string,
  markdown: boolean = false,
): React.ReactNode | string {
  const prefix = `${PKG_NAME}.`;

  // 1. Check if the input starts with 'bamboost.'
  if (!input.startsWith(prefix)) {
    // Do nothing if the prefix doesn't match
    return `${input}`;
  }

  // 2. Remove the prefix
  const afterPrefix = input.slice(prefix.length); // Remove 'bamboost.'

  // 3. Split the remaining string into segments
  const parts = afterPrefix.split(".");

  // Initialize variables to store the best (longest) matching slug
  let matchedSlug: string[] | null = null;
  let matchedLength = 0;

  // 4. Iterate through ALL_SLUGS to find the longest matching slug
  for (const slugPath of ALL_MODULES) {
    const slugLength = slugPath.length;

    // Extract the corresponding segments from the input
    const inputSlugSegments = parts.slice(0, slugLength);

    // Check if the slugPath matches the input segments
    const isMatch = slugPath.every(
      (segment, index) => segment === inputSlugSegments[index],
    );

    // If there's a match and it's longer than any previous match, store it
    if (isMatch && slugLength > matchedLength) {
      matchedSlug = slugPath;
      matchedLength = slugLength;
    }
  }

  // 5. If a matching slug is found, extract the remainder
  if (matchedSlug) {
    const remainderSegments = parts.slice(matchedLength);
    const remainder = remainderSegments.join(".");
    const href = `${API_PATH}/${matchedSlug.join("/").replace("index", "index_")}#${remainderSegments.join(".")}`;

    if (markdown) {
      return `[${remainder}](${href})`;
    }

    return (
      <Link href={href} className="text-primary decoration-primary">
        {remainder}
      </Link>
    );
  } else {
    // No matching slug found; do nothing
    return `${input}`;
  }
}
