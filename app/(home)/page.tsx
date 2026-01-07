import Link from "fumadocs-core/link";
import { blog } from "@/lib/source";
import { PathUtils } from "fumadocs-core/source";
import { Headline } from "./headline";

function getName(path: string) {
  return PathUtils.basename(path, PathUtils.extname(path));
}

export default function HomePage() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? getName(b.path)).getTime() -
      new Date(a.data.date ?? getName(a.path)).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-[1400px] md:px-4 pb-12 pt-0 md:py-12 md:pt-24">
      <Headline />

      <div className="mx-4">
        <h2 className="mt-12 mb-6 text-2xl font-bold">Latest Posts</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="flex flex-col bg-fd-card rounded-2xl border shadow-sm p-4 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <p className="font-medium">{post.data.title}</p>
              <p className="text-sm pt-2 text-fd-muted-foreground">
                {post.data.description}
              </p>

              <p className="mt-auto pt-4 text-xs text-brand gap-4 inline-flex">
                <span>
                  {new Date(
                    post.data.date ?? getName(post.path),
                  ).toDateString()}
                </span>
                <span>/</span>
                <span>{post.data.author}</span>
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <h2 className="mt-12 mb-6 text-2xl font-bold">Other projects</h2>
          <ul className="[&_a]:text-fdpy-meth list-disc list-outside pl-6">
            <li>
              <b>architile:</b> create lattices with all 11 regular or uniform
              tilings:{" "}
              <a href={"https://github.com/zrlf/architile/"}>
                https://github.com/zrlf/architile
              </a>
            </li>
            <li>
              <b>Python API docs for Fumadocs: </b>
              <a href={"https://github.com/zrlf/fumadocs-python-autodoc"}>
                https://github.com/zrlf/fumadocs-python-autodoc
              </a>
            </li>
            <li>
              <b>A reveal.js pipeline with react and markdown: </b>{" "}
              <a href="https://github.com/zrlf/reveal-react-deck">
                https://github.com/zrlf/reveal-react-deck
              </a>
            </li>
            <li>
              <b>TUI for bamboost: </b>{" "}
              <a href="https://github.com/zrlf/bamboost-tui">
                https://github.com/zrlf/bamboost-tui
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
