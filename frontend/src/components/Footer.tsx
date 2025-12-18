import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="border-t-2 border-primary grid grid-cols-3 w-full h-full p-9 bg-background">
        <div className="flex flex-col justify-between items-center">
          <h2 className="font-bold p-2 mb-2 border-purple-700 border-2 rounded-3xl">
            Ahum Maitra
          </h2>
          <p>Hello World! This my personal website!</p>
        </div>
        <div className="flex flex-col mb-4 items-center">
          <h2 className="font-bold text-[1.1rem]">Resources</h2>
          <div className="text-accent font-medium">
            <Link href={"https://github.com/TheAhumMaitra/HauntedForest"}>
              Github
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between items-center font-medium">
          <h2 className="font-bold mb-3 text-[1.1rem]">Pages</h2>
          <div className="text-accent flex flex-col gap-2">
            <Link href={"/"}>Home</Link>
            <Link href={"/about"}>About</Link>
          </div>
        </div>
      </div>
      <div className="m-3">
        <p className="lg:text-[1rem] lg:text-center font-bold sm:text-sm text-wrap">This websites source code is licensed under the terms of GPL-3.0 . This website's content is licensed under the terms of CC BY-NC-SA 4.0</p>
      </div>
    </>
  );
}
