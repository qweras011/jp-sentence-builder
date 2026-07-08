interface WordBankProps {
  pieces: string[];
  disabled: boolean;
  onSelect: (piece: string) => void;
}

export function WordBank({ pieces, disabled, onSelect }: WordBankProps) {
  return (
    <section className="space-y-1.5">
      <h3 className="text-sm font-semibold text-slate-700">단어 조각</h3>
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-3">
        {pieces.length === 0 ? (
          <p className="text-xs text-slate-400">모든 단어를 사용했습니다.</p>
        ) : (
          pieces.map((piece, index) => (
            <button
              key={`${piece}-${index}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(piece)}
              className="rounded-lg bg-indigo-500 px-3 py-1.5 font-jp text-base font-medium text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {piece}
            </button>
          ))
        )}
      </div>
    </section>
  );
}
