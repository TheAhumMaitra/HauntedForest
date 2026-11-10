import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.{md,mdx}`,
  contentType: 'mdx',
  fields: {
    image: { type: 'string', required: true },
    title: { type: 'string', required: true },
    categories: {
      type: 'list',
      of: { type: 'string' },
      required: true,
    },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    excerpt: {
      type: 'string',
      required: true,
    },
    subtitle: {
      type: 'string',
      required: false,
    },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
}))

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeKatex,
    ],
    mdxOptions(options) {
      options.development = false
      return options
    },
  },
})
