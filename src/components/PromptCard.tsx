interface PromptCardProps {
  korean: string;
}

export function PromptCard({ korean }: PromptCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="font-kr text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">{korean}</h2>
    </section>
  );
}
