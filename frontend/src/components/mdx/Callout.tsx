import React from "react";
import { Info, Lightbulb, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalloutProps {
  type?: "note" | "tip" | "warning" | "danger" | "info" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  type = "note",
  title,
  children,
  className,
}: CalloutProps) {
  const configs = {
    note: {
      icon: Info,
      border: "border-sky-500/40",
      bg: "bg-sky-500/10 text-sky-950 dark:text-sky-200",
      badge: "text-sky-600 dark:text-sky-400",
      defaultTitle: "Note",
    },
    tip: {
      icon: Lightbulb,
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/10 text-emerald-950 dark:text-emerald-200",
      badge: "text-emerald-600 dark:text-emerald-400",
      defaultTitle: "Tip",
    },
    info: {
      icon: Info,
      border: "border-blue-500/40",
      bg: "bg-blue-500/10 text-blue-950 dark:text-blue-200",
      badge: "text-blue-600 dark:text-blue-400",
      defaultTitle: "Info",
    },
    warning: {
      icon: AlertTriangle,
      border: "border-amber-500/40",
      bg: "bg-amber-500/10 text-amber-950 dark:text-amber-200",
      badge: "text-amber-600 dark:text-amber-400",
      defaultTitle: "Warning",
    },
    danger: {
      icon: AlertOctagon,
      border: "border-rose-500/40",
      bg: "bg-rose-500/10 text-rose-950 dark:text-rose-200",
      badge: "text-rose-600 dark:text-rose-400",
      defaultTitle: "Caution",
    },
    success: {
      icon: CheckCircle2,
      border: "border-green-500/40",
      bg: "bg-green-500/10 text-green-950 dark:text-green-200",
      badge: "text-green-600 dark:text-green-400",
      defaultTitle: "Success",
    },
  };

  const config = configs[type] || configs.note;
  const Icon = config.icon;

  return (
    <aside
      className={cn(
        "my-6 w-full rounded-lg border-l-4 p-4 text-sm font-sans shadow-sm",
        config.border,
        config.bg,
        className
      )}
    >
      <div className="flex items-center gap-2 font-semibold mb-2">
        <Icon className={cn("h-4 w-4 shrink-0", config.badge)} />
        <span className={config.badge}>{title || config.defaultTitle}</span>
      </div>
      <div className="text-[0.95rem] leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 font-normal">
        {children}
      </div>
    </aside>
  );
}
