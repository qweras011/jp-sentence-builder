interface FuriganaToggleProps {
  show: boolean;
  onToggle: () => void;
}

export function FuriganaToggle({ show, onToggle }: FuriganaToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        show
          ? "rounded-lg border-2 border-indigo-500 bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-300/60 transition hover:bg-indigo-600 dark:border-indigo-400 dark:bg-indigo-500 dark:shadow-indigo-900/50 dark:hover:bg-indigo-400"
          : "rounded-lg border-2 border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
      }
      aria-label={show ? "요미가나 끄기" : "요미가나 켜기"}
      aria-pressed={show}
    >
      {show ? "ふり ON" : "ふり OFF"}
    </button>
  );
}
