import Aurora from "@/components/Aurora";
import SplitText from "@/components/SplitText";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { SiCodeberg } from "react-icons/si";

export default function Page() {
  return (
    <>
      <div className="absolute top-15 -z-10 w-full h-full">
        <Aurora
          colorStops={["#55eb34", "#40008a", "#ff0073"]}
          blend={0.3}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="w-full min-h-screen p-3 flex flex-col justify-center items-center gap-10">
        <h1 className="text-center sm:text-5xl italic font-bold text-3xl text-purple-500">
          Hello, I am
        </h1>
        <div className="grid place-items-center rounded-2xl sm:scale-200">
          <SplitText
            text="Ahum Maitra"
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>
        <p className="font-semibold italic border-b-cyan-400 p-3 rounded-2xl border-4">
          Hello, World! I'm a programmer, who loves Python, JS, TS, Web
          development Frontend, Backend, Go, Rust!
        </p>
        <div className="flex flex-col justify-between items-center gap-4 mt-2">
          <h2 className="font-bold text-xl">Badges: </h2>
          <span>
            <Badge variant="outline" className="scale-120">
              Admin
            </Badge>
          </span>
          <span>
            <Badge variant="secondary" className="scale-120">
              Writer
            </Badge>
          </span>
          <span>
            <Badge variant="destructive" className="scale-120">
              Owner
            </Badge>
          </span>
        </div>
        <h2 className="font-bold text-xl">Social Links: </h2>
        <div className="flex justify-between items-center gap-8 mt-0">
          <span>
            <Link
              href={"https://github.com/TheAhumMaitra/"}
              className="cursor-pointer"
            >
              <FaGithub className="scale-150" />
            </Link>
          </span>
          <span>
            <Link
              href={"https://codeberg.org/AhumMaitra"}
              className="cursor-pointer"
            >
              <SiCodeberg className="scale-150" />
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
