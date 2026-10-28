import Aurora from "@/components/Aurora";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { SiCodeberg } from "react-icons/si";

const interests = [
  "Computer Science",
  "Python",
  "Philosophy",
  "History",
  "Geography",
  "Mathematics",
  "Science",
  "Theology",
];

const roles = ["Admin", "Writer", "Owner", "Philosopher", "Apologist"];

export default function Page() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:py-16">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 opacity-60 blur-3xl">
        <Aurora colorStops={["#8b5cf6", "#22d3ee"]} amplitude={1} blend={0.6} />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 via-sky-400/15 to-transparent text-lg font-bold tracking-tight">
            AM
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Ahum Maitra
                </h1>
                {roles.map((label) => (
                  <Badge key={label} variant="outline" className="rounded-full">
                    {label}
                  </Badge>
                ))}
              </div>

              <p className="text-base leading-relaxed text-muted-foreground">
                Hello, World! I&apos;m a programmer who loves computer science
                and Python. I also enjoy exploring philosophy, history,
                geography, mathematics, science, and theology.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Interests</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="https://github.com/TheAhumMaitra/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                <FaGithub className="text-base" />
                GitHub
              </Link>
              <Link
                href="https://codeberg.org/AhumMaitra"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                <SiCodeberg className="text-base" />
                Codeberg
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
