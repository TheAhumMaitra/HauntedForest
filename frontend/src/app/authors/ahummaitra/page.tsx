import LiquidEther from "@/components/LiquidEther";
import Shuffle from "@/components/Shuffle";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { SiCodeberg } from "react-icons/si";

export default function Page() {
  return (
    <>
      <div className="absolute inset-0 -z-10 w-full h-200">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <div className="w-full min-h-screen p-3 flex flex-col justify-center items-center gap-10">
        <h1 className="text-center sm:text-5xl italic font-bold text-3xl text-purple-500">
          Hello, I am
        </h1>
        <div className="grid place-items-center rounded-2xl sm:scale-200">
          <Shuffle
            text="Ahum Maitra"
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
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
        <div className="flex flex-col justify-between items-center gap-8 mt-2">
          <h2 className="font-bold text-xl">Social Links: </h2>
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
