import type { FeedbackState, RubySegment } from "../types/sentence";
import type { PieceMatch } from "../utils/sentenceCompare";
import { getPieceAreaMinHeight } from "../utils/wordBankLayout";
import { FuriganaText } from "./FuriganaText";

interface AnswerAreaProps {
  selectedPieces: string[];
  feedback: FeedbackState;
  ruby?: RubySegment[];
  pieceMatches?: PieceMatch[] | null;
  layoutPieceCount: number;
  onRemove: (index: number) => void;
}

export function AnswerArea({
  selectedPieces,
  feedback,
  ruby,
  pieceMatches,
  layoutPieceCount,
  onRemove,
}: AnswerAreaProps) {
  const borderColor =
    feedback === "correct"
      ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950"
      : feedback === "incorrect"
        ? "border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-950"
        : "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900";

  const title =
    feedback === "correct"
      ? "정답 · 요미가나"
      : feedback === "incorrect"
        ? "만든 문장 · 틀림"
        : "만든 문장";

  const hint =
    feedback === "correct"
      ? "정답입니다. 다음 문제로 넘어가세요."
      : feedback === "incorrect"
        ? "빨간 단어를 확인하세요."
        : null;

  const minHeight = getPieceAreaMinHeight(layoutPieceCount);

  return (
    <section className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
        {hint && (
          <p
            className={`text-xs ${feedback === "correct" ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
          >
            {hint}
          </p>
        )}
      </div>
      <div
        className={`rounded-xl border-2 border-dashed px-3 py-3 transition-colors ${borderColor}`}
        style={{ minHeight }}
      >
        <div className="flex h-full flex-wrap content-start gap-1.5">
          {feedback === "correct" && ruby ? (
            <FuriganaText segments={ruby} className="text-lg" />
          ) : selectedPieces.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">단어만 순서대로 눌러 문장을 만드세요.</p>
          ) : (
            selectedPieces.map((piece, index) => {
              const match = pieceMatches?.[index];
              const pieceStyle =
                feedback === "incorrect" && match
                  ? match.state === "correct"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-200"
                    : "border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950 dark:text-rose-200"
                  : "border-indigo-200 bg-white text-slate-800 dark:border-indigo-700 dark:bg-slate-800 dark:text-slate-100";

              return (
                <button
                  key={`${piece}-${index}`}
                  type="button"
                  onClick={() => feedback === "idle" && onRemove(index)}
                  disabled={feedback !== "idle"}
                  className={`rounded-lg border px-2.5 py-1.5 font-jp text-base shadow-sm transition enabled:hover:border-indigo-400 enabled:hover:bg-indigo-50 disabled:cursor-default dark:enabled:hover:bg-indigo-950 ${pieceStyle}`}
                  title={feedback === "idle" ? "클릭하면 되돌립니다" : undefined}
                >
                  {piece}
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
