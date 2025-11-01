import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex p-3 justify-between items-center h-full sticky top-0 border-4 border-border w-full backdrop-blur-xl rounded-2xl text-foreground">
      <Link className="text-2xl hover:text-purple-700 font-bold" href={"/"}>
        Ahum Maitra
      </Link>
      {/*Destop Navigation*/}
      <ul className="hidden lg:flex gap-4">
        <li>
          <Link
            href={"/"}
            className="hover:font-bold hover:bg-cyan-600 hover:p-2 hover:rounded-xl transition-all"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href={"/about"}
            className="hover:font-bold hover:bg-cyan-600 hover:p-2 hover:rounded-xl transition-all"
          >
            About Me
          </Link>
        </li>
      </ul>
      <ModeToggle />
      {/*Mobile Navigation*/}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger>
            <Image
              src={"/menu-mobile.svg"}
              alt="Mobile menu icon"
              className="lg:hidden mt-3 cursor-pointer"
              width={32}
              height={32}
            />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-center">Ahum Maitra</SheetTitle>
            </SheetHeader>
            <ul className="flex justify-center items-center lg:hidden flex-col gap-4">
              <li className="border-4 p-2 border-border">
                <Link
                  href={"/"}
                  className="hover:font-bold hover:bg-cyan-600 hover:p-2 hover:rounded-xl transition-all"
                >
                  Home
                </Link>
              </li>
              <li className="border-4 p-2 border-border">
                <Link
                  href={"/about"}
                  className="hover:font-bold hover:bg-cyan-600 hover:p-2 hover:rounded-xl transition-all"
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
