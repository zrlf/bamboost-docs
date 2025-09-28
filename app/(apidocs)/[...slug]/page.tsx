import { autodocSources } from "@/lib/autodocSource";
import { makePage } from "fumadocs-python-autodoc/components";

const { Page, generateStaticParams, generateMetadata } =
  makePage(autodocSources);

export default Page;
export { generateStaticParams, generateMetadata };
