import cn from "clsx";
import { Link } from "nextra-theme-docs";

export const classes = {
  ul: "space-y-5 list-disc ml-5",
  // hl: "bg-highlight rounded py-0.5 px-1 font-semibold",
  hl: "font-semibold",
  signatureInline: "italic ml-1 opacity-40 text-[.8em]",
  prefix: "opacity-40 text-[.8em]",
  backgroundClass: cn("bg-[var(--primary-bg)] shadow-xl dark:shadow-[#040404]"),
};

export const Divider = () => {
  return <div className="bg-gray-700 h-[1px] w-full"></div>;
};

export function RenderMarkdownString({ children }: { children: string }) {
  //split the input string by new line
  const lines = children.split("\n\n");
  return (
    <>
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </>
  );
}

export function LinkAnnotation({ children }: { children: string }) {
  // if children contains bamboost, return a link to bamboost
  children = children.replace(/[^a-zA-Z0-9._ ]/g, "");

  // remove any occurence of class, func, etc
  children = children.replace(/(class|func|method|module|object)/g, "");

  if (children.includes("bamboost")) {
    // create display text by taking the last part of the children
    // example: bamboost.components.Button -> Button
    const displayText = children.split(".").pop();

    // href is text aftre the word "bamboost" split by ., joined by / and last part joined by #
    // example: bamboost.components.Button -> /components/Button#Button
    const href =
      "/apidocs/" +
      children.split("bamboost.")[1].split(".").slice(0, -1).join("/") +
      "#" +
      children.split(".").pop();
    return (
      <Link href={href} newWindow={false} className="underline">
        {displayText}
      </Link>
    );
  }
  return <code>{children}</code>;
}
