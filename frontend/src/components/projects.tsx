'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Hyperspeed from "./Hyperspeed";

type Project = {
  name: string;
  description: string;
  stack: string[];
  repo: string;
  live?: string;
};

const projects: Project[] = [
  {
    name: "Aurora",
    description: "A preconfigured Hyprland setup",
    stack: ["Rust", "Lua", "Bash", "QML", "JS", "CLI", "Hyprland", "Linux"],
    repo: "https://github.com/TheAhumMaitra/Aurora",
    live: "https://hypraurora.vercel.app",
  },
  {
    name: "Itomori",
    description: "A quick notes taker app",
    stack: ["TUI", "Textual", "Python", "bash", "CSS"],
    repo: "https://github.com/TheAhumMaitra/Itomori",
    live: "https://itomori.vercel.app",
  },
  {
    name: "Kimino",
    description: "A desktop entry creator for Linux.",
    stack: ["Python", "TUI", "Textual", "Linux"],
    repo: "https://github.com/TheAhumMaitra/Kimino",
    live: "https://kimino-tau.vercel.app/",
  },

  {
    name: "Ave Maria",
    description: "Opionated NixOS config",
    stack: ["Nix", "NixOS"],
    repo: "https://github.com/TheAhumMaitra/Ave-Maria",
  },
];

export default function Projects() {
  return (
    <div className="relative h-150 w-full overflow-hidden rounded-2xl bg-black">
      <div className="absolute inset-0">
        <Hyperspeed
          curve="winding"
          curvature={1}
          speed={1}
          boost={3}
          fov={90}
          boostFov={130}
          lanes={3}
          roadWidth={10}
          medianWidth={2}
          density={40}
          trailLength={1}
          lightSize={1}
          poles={20}
          dust={100}
          glow={0.6}
          reflections={0.5}
          roadOpacity={0.1}
          steer={0.35}
          tailColors={["#d856bf", "#6750a2", "#c247ac"]}
          headColors={["#03b3c3", "#0e5ea5", "#324555"]}
          poleColors={["#03b3c3"]}
          interactive
          roadColor="#08080a"
          lineColor="#25252d"
          background="transparent"
          onBoostStart={() => {}}
          onBoostEnd={() => {}}
          style={{ background: "transparent" }}
        />
      </div>

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex h-full flex-col justify-center gap-5 p-6">
        <h1 className="text-2xl font-bold text-white underline">Projects</h1>

        <div className="overflow-x-auto pb-2">
          <div
            className="grid grid-flow-col auto-cols-[minmax(0,280px)] gap-4"
            style={{ minWidth: "46rem" }}
          >
            {projects.map((project) => (
              <Card
                key={project.name}
                className="flex h-full w-full flex-col justify-between border border-white/10 bg-background/80 shadow-lg shadow-black/20 backdrop-blur-sm"
                style={{ minHeight: "22rem" }}
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-muted/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="mt-auto flex-col gap-2">
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    <Button type="button" className="w-full">
                      Visit the repo
                    </Button>
                  </a>

                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full"
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                      >
                        Live site
                      </Button>
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
