import { defineConfig, defineCollection, s } from "velite";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.{md,mdx}",
  schema: s
    .object({
      slug: s.path(),
      title: s.string(),
      subtitle: s.string().optional(),
      image: s.string(),
      categories: s.array(s.string()),
      date: s.isodate(),
      author: s.string(),
      excerpt: s.string(),
      body: s.mdx(),
      raw: s.raw(),
    })
    .transform((data) => {
      const slug = data.slug.replace(/^posts\//, "");
      return {
        ...data,
        slug,
        url: `/posts/${slug}`,
        body: {
          raw: data.raw,
          code: data.body,
        },
        _raw: {
          flattenedPath: slug,
        },
      };
    }),
});

const poems = defineCollection({
  name: "Poem",
  pattern: "poems/**/*.{md,mdx}",
  schema: s
    .object({
      slug: s.path(),
      title: s.string(),
      subtitle: s.string().optional(),
      date: s.isodate(),
      author: s.string().default("Ahum Maitra"),
      form: s.string().optional(),
      mood: s.string().optional(),
      writtenAt: s.string().optional(),
      categories: s.array(s.string()).optional(),
      tags: s.array(s.string()).optional(),
      image: s.string().optional(),
      audio: s.string().optional(),
      excerpt: s.string().optional(),
      body: s.mdx(),
      raw: s.raw(),
    })
    .transform((data) => {
      const slug = data.slug.replace(/^poems\//, "");
      const tags = Array.from(
        new Set([...(data.tags || []), ...(data.categories || [])])
      );
      const rawContent = (data.raw || "").replace(/^---[\s\S]*?---/, "").trim();
      const firstLines = rawContent
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#") && !l.startsWith("!"))
        .slice(0, 3)
        .join("\n");
      const excerpt = data.excerpt || firstLines || "A verse from the forest.";

      const lines = rawContent
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"));

      const stanzas = rawContent
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      return {
        ...data,
        slug,
        tags,
        excerpt,
        url: `/poems/${slug}`,
        linesCount: lines.length,
        stanzasCount: stanzas.length,
        body: {
          raw: data.raw,
          code: data.body,
        },
        _raw: {
          flattenedPath: slug,
        },
      };
    }),
});

export default defineConfig({
  root: ".",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, poems },
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      rehypeKatex,
    ],
  },
});
