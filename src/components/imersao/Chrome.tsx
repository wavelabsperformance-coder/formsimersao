import type { ReactNode } from "react";

export function Wordmark({ muted = false }: { muted?: boolean }) {
  return (
    <span
      className={[
        "label-eyebrow",
        muted ? "text-muted-foreground" : "text-foreground",
      ].join(" ")}
    >
      Imersão que <span className="text-primary">Transforma</span>
    </span>
  );
}

export function Progress({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  return (
    <div className="flex items-center gap-4">
      <span className="label-eyebrow text-muted-foreground">
        {String(current).padStart(2, "0")} de {total}
      </span>
      <div className="h-px flex-1 bg-hairline">
        <div
          className="h-px bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Progresso do diagnóstico"
        />
      </div>
    </div>
  );
}

export function PrimaryAction({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="group inline-flex min-h-14 items-center gap-5 bg-secondary px-8 py-4 label-eyebrow text-secondary-foreground transition-colors duration-300 hover:bg-primary"
    >
      {children}
      <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
        →
      </span>
    </button>
  );
}

export function GhostAction({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 label-eyebrow text-muted-foreground underline-offset-8 transition-colors duration-300 hover:text-primary hover:underline"
    >
      {children}
    </button>
  );
}
