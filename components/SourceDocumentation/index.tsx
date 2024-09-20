import React from "react";
import cn from "clsx";
import { Link } from "nextra-theme-docs";
import MarkdownOriginal from "marked-react";
import { Callout } from "../Callout";

import { API_PATH, ALL_MODULES, PKG_NAME } from "@/constants";

export const classes = {
  ul: "space-y-2 md:space-y-2 list-disc ml-5",
  hl: "font-semibold",
  signatureInline: "italic ml-1 opacity-40 text-[.8em]",
  prefix: "opacity-40 text-[.8em]",
  backgroundClass: cn("bg-[var(--primary-bg)] shadow-xl dark:shadow-[#040404]"),
};

export const Divider = () => {
  return <div className="bg-gray-700 h-[1px] w-full"></div>;
};

/**
 * Markdown component for rendering markdown content with special handling for annotations (Note, Warning) and links.
 *
 * @param {Object} props - The component props
 * @param {string} props.children - The markdown content to be rendered
 * @returns {React.ReactElement|null} The rendered markdown content or null if no content is provided
 */
export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}): React.ReactElement | null {
  if (!children) return null;

  // Function to get the indentation level of a line
  function getIndentationLevel(line: string) {
    return line.match(/^ */)[0].length;
  }

  // Function to split the string into parts based on indicators
  function splitStringByIndicators(input: string) {
    const lines = input.split("\n");
    const parts = [];
    let currentPart = [];
    let i = 0;
    const indicatorMap = {
      Note: "info",
      Notes: "info",
      Warning: "warning",
      Warnings: "warning",
    };

    while (i < lines.length) {
      const line = lines[i];
      const indicatorMatch = line.match(
        /^\s*(Note|Notes|Warning|Warnings)(\s*:?\s*)?$/,
      );

      if (indicatorMatch) {
        // Save current part before the indicator
        if (currentPart.length > 0) {
          parts.push(currentPart.join("\n").trim());
          currentPart = [];
        }

        const indicator = indicatorMatch[1];
        const indicatorIndentLevel = getIndentationLevel(line);
        const annotationBlockIndentLevel =
          i + 1 < lines.length ? getIndentationLevel(lines[i + 1]) : 0;
        const indentedBlockLines = [];
        i++; // Move to the next line

        // Collect the indented block after the indicator
        while (i < lines.length) {
          const nextLine = lines[i];
          const nextLineIndentLevel = getIndentationLevel(nextLine);
          // Check if the line is indented more than the indicator
          if (
            nextLine.trim() === "" ||
            nextLineIndentLevel > indicatorIndentLevel
          ) {
            // Slice the line by exactly the number of spaces equal to indicatorIndentLevel
            const slicedLine = nextLine.slice(annotationBlockIndentLevel);
            indentedBlockLines.push(slicedLine);
            i++;
          } else {
            break;
          }
        }

        // Save the indicator and its indented block as an object
        parts.push({
          indicator: indicatorMap[indicator],
          content: indentedBlockLines.join("\n").trim(),
        });
      } else {
        currentPart.push(line);
        i++;
      }
    }

    // Save any remaining text after the last indicator
    if (currentPart.length > 0) {
      parts.push(currentPart.join("\n").trim());
    }

    return parts;
  }

  const replaceAnchorsWithLinks = (href: string, text: React.ReactNode) => {
    return (
      <code>
        <Link href={href} newWindow={false}>
          {text}
        </Link>
      </code>
    );
  };

  // replace all occurences of `bamboost.*` with a link to the corresponding page
  const content = children.replace(/`([^`]+)`/g, (match, p1) => {
    return linkifyPkg(p1, true);
  });

  const result: (
    | string
    | { indicator: "info" | "warning"; content: string }
  )[] = splitStringByIndicators(content);

  const renderer = {
    link: replaceAnchorsWithLinks,
    list: (children: any, ordered: boolean) => {
      if (ordered) {
        return (
          <ol
            className={`list-disc [&>li]:ml-5 ${typeof parent !== "undefined" && !parent ? "my-2" : ""}`}
          >
            {children}
          </ol>
        );
      } else {
        return (
          <ul
            className={`list-disc [&>li]:ml-5 ${typeof parent !== "undefined" && !parent ? "my-2" : ""}`}
          >
            {children}
          </ul>
        );
      }
    },
    paragraph: (children: any) => (
      <p className="[&:not(:last-child)]:mb-3">{children}</p>
    ),
  };

  return (
    <div className={cn(className)}>
      {result.map((part, index) => {
        if (typeof part === "string") {
          return (
            <MarkdownOriginal key={index} renderer={renderer}>
              {part}
            </MarkdownOriginal>
          );
        } else {
          return (
            <Callout key={index} type={part.indicator}>
              <MarkdownOriginal renderer={renderer}>
                {part.content}
              </MarkdownOriginal>
            </Callout>
          );
        }
      })}
    </div>
  );
}

export function LinkAnnotation({ children }: { children: string }) {
  // Remove any non-alphanumeric characters except dots, underscores, brackets, and spaces
  const cleanedChildren = children.replace(/[^a-zA-Z0-9._\[\]() ]/g, "");

  // Remove any occurrence of class, func, etc.
  const filteredChildren = cleanedChildren.replace(/(class|func|method|module|object)/g, "").trim();

  // Find the part of the string that starts with 'bamboost.'
  const match = filteredChildren.match(new RegExp(`${PKG_NAME}\\.[a-zA-Z0-9._]+`));

  if (match) {
    const bamboostPart = match[0];
    const parsedElement = linkifyPkg(bamboostPart, false);

    // Create the full element by combining the parsed part with the rest of the string
    const beforeMatch = filteredChildren.slice(0, match.index);
    const afterMatch = filteredChildren.slice(match.index + bamboostPart.length);

    return (
      <code>
        {beforeMatch}
        {parsedElement}
        {afterMatch}
      </code>
    );
  }

  return <code>{filteredChildren}</code>;
}

/**
 * Parses the input string to extract the slug and remainder based on ALL_SLUGS.
 * @param input - The input string to be parsed.
 * @returns A link or the original input string.
 */
function linkifyPkg(input: string, markdown: true): string;
function linkifyPkg(input: string, markdown?: false): React.ReactNode;
function linkifyPkg(
  input: string,
  markdown: boolean = false,
): React.ReactNode | string {
  const prefix = `${PKG_NAME}.`;

  // 1. Check if the input starts with 'bamboost.'
  if (!input.startsWith(prefix)) {
    // Do nothing if the prefix doesn't match
    return input;
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

    if (markdown) {
      return `[${remainder}](${API_PATH}/${matchedSlug.join("/")}#${remainder})`;
    }

    return (
      <Link
        href={`${API_PATH}/${matchedSlug.join("/")}#${remainder}`}
        newWindow={false}
      >
        {remainder}
      </Link>
    );
  } else {
    // No matching slug found; do nothing
    return input;
  }
}
