import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    image: { type: 'string', required: true },
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: {type: 'string', required: true},
    excerpt: {
      type: 'string',
      required: true
    },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
}))

export default makeSource({ contentDirPath: 'posts', documentTypes: [Post] })
