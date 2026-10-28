import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./theme-toggle";

const navItems = {
  "/": "Home",
  "/about": "About",
  "/posts": "Articles",
};

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          Ahum Maitra
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <ul className="flex items-center justify-center gap-6">
            {Object.entries(navItems).map(([path, name]) => (
              <li key={path}>
                <Link
                  href={path}
                  className="rounded-md font-medium px-2 py-2 transition-colors hover:bg-accent"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="flex items-center justify-center rounded-md p-2 hover:bg-accent"
                >
                  <IoMenu className="text-xl" />
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Ahum Maitra</SheetTitle>
                </SheetHeader>
                <ul className="mt-6 flex flex-col items-center gap-4">
                  {Object.entries(navItems).map(([path, name]) => (
                    <li key={path}>
                      <Link
                        href={path}
                        className="block rounded-md px-3 py-2 transition-colors hover:bg-accent"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
