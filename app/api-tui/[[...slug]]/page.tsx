import { sources } from "@/fumapy/lib/source.api";
import usePage from "@/fumapy/layout/page";

const { default: Page, generateStaticParams, generateMetadata } = usePage(sources.bamboostcli);

export { generateStaticParams, generateMetadata };
export default Page;

