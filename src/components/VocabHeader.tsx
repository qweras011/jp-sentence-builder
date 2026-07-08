import type { VocabDirection } from "../types/vocab";
import { VOCAB_DAILY_GOAL } from "../utils/daily";
import { VocabDirectionToggle } from "./VocabDirectionToggle";

interface VocabHeaderProps {
  completed: number;
  dateLabel: string;
  reviewCount: number;
  freshCount: number;
  direction: VocabDirection;
  onDirectionChange: (direction: VocabDirection) => void;
  onHome?: () => void;
}

export function VocabHeader({
  completed,
  dateLabel,
  reviewCount,
  freshCount,
  direction,
  onDirectionChange,
  onHome,
}: VocabHeaderProps) {
  const progress = Math.round((completed / VOCAB_DAILY_GOAL) * 100);

  return (
    <header className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">단어 외우기</p>
        <div className="flex items-center gap-2">
          <VocabDirectionToggle direction={direction} onChange={onDirectionChange} />
          <p className="text-xs text-slate-400 dark:text-slate-500">{dateLabel}</p>
          {onHome && (
            <button
              type="button"
              onClick={onHome}
              className="rounded-md px-2 py-0.5 text-xs text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:text-slate-400 dark:ring-slate-600 dark:hover:bg-slate-700"
            >
              홈
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-medium text-emerald-700 dark:text-emerald-400">
          오늘 {completed} / {VOCAB_DAILY_GOAL}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          복습 {reviewCount} · 신규 {freshCount}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
