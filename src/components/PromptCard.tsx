interface PromptCardProps {
  korean: string;
}

export function PromptCard({ korean }: PromptCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <h2 className="font-kr text-lg font-bold leading-snug text-slate-900">{korean}</h2>
    </section>
  );
}
