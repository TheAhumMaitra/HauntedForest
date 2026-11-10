import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full max-w-full overflow-x-hidden border-t-2 border-primary bg-background">
      <div className="text-center flex flex-col gap-4 sm:grid sm:grid-cols-3 w-full p-5 sm:p-9">
        <div className="flex flex-col justify-between items-center">
          <h2 className="font-bold p-2 mb-2 border-purple-700 border-2 rounded-3xl">
            Ahum Maitra
          </h2>
          <p className="font-medium text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">
            This website contains works, documents, articles, etc and stories. This website itself is not a portfolio and this website can contain weird features, it also may contain sound effects sometimes (which is not harmful for ears [normal users]). It can show some videos and some new things I am exploring.
          </p>
        </div>
        <div className="flex flex-col mb-4 items-center">
          <h2 className="font-bold text-[1.1rem]">Resources</h2>
          <div className="text-accent flex flex-col gap-2 mt-2 font-medium">
            <Link href={"https://github.com/TheAhumMaitra/HauntedForest"}>
              Github
            </Link>
            <Link href={"https://codeberg.org/AhumMaitra"}>Codeberg</Link>
          </div>
        </div>
        <div className="flex flex-col items-center font-medium">
          <h2 className="font-bold mb-3 text-[1.1rem]">Pages</h2>
          <div className="text-accent flex flex-col gap-2">
            <Link href={"/"}>Home</Link>
            <Link href={"/about"}>About</Link>
            <Link href={"/posts"}>Blog Posts</Link>
          </div>
        </div>
      </div>

      {/* Videos Section: flex-col on mobile, flex-row on desktop */}
      <div className="flex flex-col my-4 px-3 sm:px-6 font-bold justify-center items-center text-center w-full max-w-full">
        <h2 className="text-xl sm:text-2xl underline italic mb-4">
          My Most fav songs comes from
        </h2>
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-5xl mx-auto">
          <div className="w-full max-w-[560px] aspect-video rounded-2xl overflow-hidden border border-border shadow-lg bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/PgZ0aPXOd4Y?si=15hhlWJnZyL7CG7R"
              title="YouTube video player - 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="w-full max-w-[560px] aspect-video rounded-2xl overflow-hidden border border-border shadow-lg bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/H9yfuYDoGf4?si=Xs-A1acpERkWT9Gc"
              title="YouTube video player - 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="my-6 px-4">
        <p className="text-xs sm:text-sm text-center font-bold text-wrap">
          &copy; Copyright by Ahum Maitra. All rights reserved by Ahum Maitra.
        </p>
        <p className="text-xs sm:text-sm text-center mt-2 italic font-medium text-muted-foreground">
          This website&apos;s source code (excluding content) is licensed under the terms of GPL-3.0.
        </p>
      </div>
    </footer>
  );
}
