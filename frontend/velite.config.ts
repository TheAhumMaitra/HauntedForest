import { defineConfig, defineCollection, s } from "velite";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";

const posts = defineCollection({
  name: "Post",
  pattern: "**/*.{md,mdx}",
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
    .transform((data) => ({
      ...data,
      url: `/posts/${data.slug}`,
      body: {
        raw: data.raw,
        code: data.body,
      },
      _raw: {
        flattenedPath: data.slug,
      },
    })),
});

export default defineConfig({
  root: "posts",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      rehypeKatex,
    ],
  },
});
