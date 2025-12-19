import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { SiCodeberg } from "react-icons/si";
import { ModeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <nav className="flex p-3 justify-stretch items-center h-full sticky top-0 border-4 border-border w-full backdrop-blur-xl rounded-2xl text-foreground">
      <Link
        className="text-2xl hover:border-2 hover:p-1 hover:border-purple-500 hover:rounded-3xl transition-all font-bold"
        href={"/"}
      >
        Ahum Maitra
      </Link>
      {/*Destop Navigation*/}
      <ul className="hidden lg:flex gap-4 ml-7 font-medium">
        <li>
          <Link
            href={"/"}
            className="hover:font-bold hover:bg-purple-600 hover:p-2 hover:rounded-xl transition-all"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href={"/about"}
            className="hover:font-bold hover:bg-purple-600 hover:p-2 hover:rounded-xl transition-all"
          >
            About Me
          </Link>
        </li>
         <li>
          <Link
            href={"/posts"}
            className="hover:font-bold hover:bg-purple-600 hover:p-2 hover:rounded-xl transition-all"
          >
            Posts
          </Link>
        </li>
      </ul>
      <div className="ml-auto self-end flex justify-between items-center gap-4 mr-4">
        <ModeToggle />
        <div className="flex gap-5">
          <Link
            href={"https://github.com/TheAhumMaitra/"}
            className="cursor-pointer"
          >
            <FaGithub className="scale-150" />
          </Link>
          <Link
            href={"https://codeberg.org/AhumMaitra"}
            className="cursor-pointer"
          >
            <SiCodeberg className="scale-150" />
          </Link>
        </div>
      </div>
      {/*Mobile Navigation*/}
      <div className="lg:hidden ml-6 flex justify-center items-center">
        <Sheet>
          <SheetTrigger>
            <IoMenu className="scale-150" />
          </SheetTrigger>
          <SheetContent className="w-full">
            <SheetHeader>
              <SheetTitle className="text-center">Ahum Maitra</SheetTitle>
            </SheetHeader>
            <ul className="flex justify-center items-center lg:hidden flex-col gap-4">
              <li className="border-4 p-2 border-border">
                <Link
                  href={"/"}
                  className="hover:font-bold hover:bg-purple-600 hover:p-2 hover:rounded-xl transition-all"
                >
                  Home
                </Link>
              </li>
              <li className="border-4 p-2 border-border">
                <Link
                  href={"/about"}
                  className="hover:font-bold hover:bg-purple-600 hover:p-2 hover:rounded-xl transition-all"
                >
                  About Me
                </Link>
              </li>
              <li className="border-4 p-2 border-border">
                <Link
                  href={"/posts"}
                  className="hover:font-bold hover:bg-purple-600 hover:p-2 hover:rounded-xl transition-all"
                >
                  Blog Posts
                </Link>
              </li>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
