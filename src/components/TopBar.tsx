import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  dark: boolean;
  onToggleTheme: () => void;
  showHome?: boolean;
  onHome?: () => void;
}

export function TopBar({ dark, onToggleTheme, showHome = false, onHome }: TopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-3 py-2.5">
        <div className="min-w-[4.5rem]">
          {showHome && onHome && (
            <button
              type="button"
              onClick={onHome}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              ← 홈
            </button>
          )}
        </div>
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
