// app/posts/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation"; // Better than throwing a raw error

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

// 1. Add 'async' and 'await params'
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) return { title: "Post Not Found. Sorry I tried to find that post." };
  return { title: post.title };
};

// 2. Add 'async' and 'await params'
const PostLayout = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  // 3. Use notFound() for a better UX instead of crashing the server
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen mw-full">
      <article className="mx-auto max-w-xl py-8">
        <div className="mb-8 text-center">
          <Image className="border-border border-4 rounded-2xl mb-3" alt="Post image" src={post.image as string} width={800} height={500}/>
          <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
            {format(parseISO(post.date), "LLLL d, yyyy")}
          </time>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <h2 className="text-purple-500 font-semibold">
            <Link href={"/authors/ahummaitra"}>
            {post.author}
            </Link>
            </h2>
        </div>
        <div
          className="[&>*]:mb-3 [&>*:last-child]:mb-0 font-medium"
          dangerouslySetInnerHTML={{ __html: post.body.html }}
        />
      </article>
    </div>
  );
};

export default PostLayout;
