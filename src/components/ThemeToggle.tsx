interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ dark, onToggle, className = "" }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${className}`}
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {dark ? "☀️ 라이트" : "🌙 다크"}
    </button>
  );
}
