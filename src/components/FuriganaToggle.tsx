interface FuriganaToggleProps {
  show: boolean;
  onToggle: () => void;
}

export function FuriganaToggle({ show, onToggle }: FuriganaToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      aria-label={show ? "요미가나 끄기" : "요미가나 켜기"}
      aria-pressed={show}
    >
      {show ? "ふり ON" : "ふり OFF"}
    </button>
  );
}
