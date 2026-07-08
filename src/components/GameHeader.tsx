import { SENTENCE_DAILY_GOAL } from "../utils/daily";

interface GameHeaderProps {
  completed: number;
  dateLabel: string;
  unseenCount: number;
  repeatCount: number;
}

export function GameHeader({
  completed,
  dateLabel,
  unseenCount,
  repeatCount,
}: GameHeaderProps) {
  const progress = Math.round((completed / SENTENCE_DAILY_GOAL) * 100);

  return (
    <header className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">일본어 문장 만들기</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{dateLabel}</p>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-medium text-violet-700 dark:text-violet-400">
          오늘 {completed} / {SENTENCE_DAILY_GOAL}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {repeatCount > 0 ? `처음 ${unseenCount} · 다시 ${repeatCount}` : `처음 ${unseenCount}`}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
