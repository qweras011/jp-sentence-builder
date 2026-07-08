import type { VocabDirection } from "../types/vocab";

interface VocabDirectionToggleProps {
  direction: VocabDirection;
  onChange: (direction: VocabDirection) => void;
}

export function VocabDirectionToggle({ direction, onChange }: VocabDirectionToggleProps) {
  return (
    <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs dark:border-slate-600 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => onChange("forward")}
        className={`rounded-md px-2.5 py-1 font-medium transition ${
          direction === "forward"
            ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        일→한
      </button>
      <button
        type="button"
        onClick={() => onChange("reverse")}
        className={`rounded-md px-2.5 py-1 font-medium transition ${
          direction === "reverse"
            ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        한→일
      </button>
    </div>
  );
}
