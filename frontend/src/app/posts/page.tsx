import { allPosts, Post } from "contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";

function PostCard(post: Post) {
  return (
    <div className="flex flex-col justify-between items-center gap-4 w-full h-full">
      <div className="mb-8 p-4 h-full bg-card rounded-2xl">
        <Image
          className="border-border border-4 rounded-2xl mb-3"
          alt="Post image"
          src={post.image}
          width={800}
          height={500}
        />
        <h2 className="mb-3 text-xl">
          <Link
            href={post.url}
            className="cursor-pointer text-card-foreground hover:text-blue-900 dark:text-purple-600 font-bold"
          >
            {post.title}
          </Link>
        </h2>
        <h2 className="font-semibold p-2 rounded-2xl border-2 border-border w-38 text-yellow-400 mb-3">
          <span className="font-medium text-gray-500 mr-3 text-sm">By</span>
          {post.author}
        </h2>
        <time dateTime={post.date} className="mb-2 block text-xs text-gray-600">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <hr className="h-3 mb-3" />
        <p className="line-clamp-3 text-sm font-medium text-gray-400">{post.excerpt}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="mx-auto max-w-xl min-h-screen py-8">
      <h1 className="mb-8 text-center text-2xl font-black underline">
        All Posts
      </h1>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
}
