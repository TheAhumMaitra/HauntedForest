import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { IoMenu } from "react-icons/io5";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="flex p-3 justify-stretch items-center h-full sticky top-0 border-4 border-border w-full backdrop-blur-xl rounded-2xl text-foreground">
      <Link className="text-2xl hover:border-2 hover:p-1 hover:border-purple-500 hover:rounded-3xl transition-all font-bold" href={"/"}>
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
      </ul>
      <div className="ml-auto self-end flex justify-between items-center gap-4 mr-4">
      <ModeToggle />
      <FaGithub className="scale-150 cursor-pointer"/>
      </div>
      {/*Mobile Navigation*/}
      <div className="lg:hidden ml-6 flex justify-center items-center">
        <Sheet>
          <SheetTrigger>
            <IoMenu className="scale-150" />
          </SheetTrigger>
          <SheetContent>
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
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
