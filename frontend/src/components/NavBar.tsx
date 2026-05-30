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
    <nav className="flex items-center justify-between p-4 sticky top-0 border-b bg-background/80 backdrop-blur-sm">
      <Link href="/" className="text-xl font-bold">
        Ahum Maitra
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-6 items-center">
        {Object.entries(navItems).map(([path, name]) => (
          <li key={path}>
            <Link href={path} className="hover:bg-accent p-2 transition-colors">
              {name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 ml-auto">
        <ModeToggle />

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <IoMenu className="scale-150" />
            </SheetTrigger>
            <SheetContent className="w-full">
              <SheetHeader>
                <SheetTitle>Ahum Maitra</SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-4 mt-6">
                {Object.entries(navItems).map(([path, name]) => (
                  <li key={path}>
                    <Link
                      href={path}
                      className="block p-2 hover:bg-accent transition-colors"
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
    </nav>
  );
}
