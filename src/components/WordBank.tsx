import { JapanesePiece } from "./JapanesePiece";
import { getWordBankBodyMinHeight } from "../utils/wordBankLayout";

interface WordBankProps {
  pieces: string[];
  disabled: boolean;
  onSelect: (piece: string) => void;
  layoutPieceCount: number;
  showFurigana: boolean;
  pieceReadings?: Map<string, string>;
}

export function WordBank({
  pieces,
  disabled,
  onSelect,
  layoutPieceCount,
  showFurigana,
  pieceReadings,
}: WordBankProps) {
  const minHeight = getWordBankBodyMinHeight(layoutPieceCount);

  return (
    <section className="space-y-1.5">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">단어 조각</h3>
      <div
        className="flex flex-wrap content-start gap-1.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-slate-800"
        style={{ minHeight }}
      >
        {pieces.length === 0 ? (
          <p className="text-xs text-slate-400">모든 단어를 사용했습니다.</p>
        ) : (
          pieces.map((piece, index) => (
            <button
              key={`${piece}-${index}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(piece)}
              className="piece-on-indigo rounded-lg bg-indigo-500 px-3 py-1.5 font-jp text-base font-medium text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <JapanesePiece
                text={piece}
                reading={pieceReadings?.get(piece)}
                showFurigana={showFurigana}
              />
            </button>
          ))
        )}
      </div>
    </section>
  );
}
