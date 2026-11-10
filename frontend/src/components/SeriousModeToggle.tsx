"use client";

import React, { useSyncExternalStore } from "react";
import { Ghost, Shield, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SERIOUS_MODE_KEY,
  SERIOUS_MODE_EVENT,
  TRIGGER_MONSTER_EVENT,
} from "./MonsterEncounter";

function subscribe(callback: () => void) {
  window.addEventListener(SERIOUS_MODE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SERIOUS_MODE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SERIOUS_MODE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

export function SeriousModeToggle() {
  const isSerious = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleMode = (enableSerious: boolean) => {
    localStorage.setItem(SERIOUS_MODE_KEY, enableSerious ? "true" : "false");
    window.dispatchEvent(
      new CustomEvent(SERIOUS_MODE_EVENT, { detail: { serious: enableSerious } })
    );
  };

  const testTrigger = () => {
    if (isSerious) {
      toggleMode(false);
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(TRIGGER_MONSTER_EVENT));
    }, 150);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 gap-1.5 px-3 font-mono text-xs transition-all ${
            isSerious
              ? "border-emerald-600/40 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300"
              : "border-red-600/50 bg-red-950/30 text-red-400 hover:bg-red-950/50 hover:text-red-300 hover:border-red-500"
          }`}
          aria-label="Toggle Serious / Haunted Mode"
        >
          {isSerious ? (
            <>
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Serious: ON</span>
            </>
          ) : (
            <>
              <Ghost className="h-3.5 w-3.5 text-red-500 animate-pulse" />
              <span className="hidden sm:inline">Haunted</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 font-mono text-xs">
        <DropdownMenuLabel className="flex items-center justify-between text-xs font-semibold">
          <span>Website Atmosphere</span>
          {isSerious ? (
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider">Safe</span>
          ) : (
            <span className="text-[10px] text-red-500 uppercase tracking-wider animate-pulse">Danger</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => toggleMode(true)}
          className={`flex items-center gap-2 cursor-pointer ${isSerious ? "font-bold text-emerald-400" : ""}`}
        >
          <Shield className="h-4 w-4 text-emerald-400" />
          <div className="flex flex-col">
            <span>Serious Mode</span>
            <span className="text-[10px] text-muted-foreground font-sans">
              Disable jumpscares & monsters
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => toggleMode(false)}
          className={`flex items-center gap-2 cursor-pointer ${!isSerious ? "font-bold text-red-400" : ""}`}
        >
          <Ghost className="h-4 w-4 text-red-500" />
          <div className="flex flex-col">
            <span>Haunted Mode</span>
            <span className="text-[10px] text-muted-foreground font-sans">
              Random monster encounters enabled
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={testTrigger}
          className="flex items-center gap-2 text-destructive cursor-pointer hover:!text-destructive hover:!bg-destructive/10"
        >
          <ShieldAlert className="h-4 w-4" />
          <div className="flex flex-col">
            <span>Summon Monster (Test)</span>
            <span className="text-[10px] text-muted-foreground font-sans">
              Appears in pitch black & grows bigger each time
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
