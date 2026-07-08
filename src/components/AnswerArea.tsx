import type { FeedbackState, RubySegment } from "../types/sentence";
import { FuriganaText } from "./FuriganaText";

interface AnswerAreaProps {
  selectedPieces: string[];
  feedback: FeedbackState;
  ruby?: RubySegment[];
  onRemove: (index: number) => void;
}

export function AnswerArea({
  selectedPieces,
  feedback,
  ruby,
  onRemove,
}: AnswerAreaProps) {
  const borderColor =
    feedback === "correct"
      ? "border-emerald-400 bg-emerald-50"
      : feedback === "incorrect"
        ? "border-amber-400 bg-amber-50"
        : "border-slate-300 bg-slate-50";

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
        ? "목록 맨 뒤로 넘어갑니다."
        : null;

  return (
    <section className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        {hint && (
          <p
            className={`text-xs ${feedback === "correct" ? "text-emerald-700" : "text-amber-700"}`}
          >
            {hint}
          </p>
        )}
      </div>
      <div
        className={`rounded-xl border-2 border-dashed px-3 py-2.5 transition-colors ${borderColor}`}
      >
        {feedback === "correct" && ruby ? (
          <FuriganaText segments={ruby} className="text-lg" />
        ) : selectedPieces.length === 0 ? (
          <p className="text-sm text-slate-400">단어를 순서대로 눌러 문장을 만드세요.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedPieces.map((piece, index) => (
              <button
                key={`${piece}-${index}`}
                type="button"
                onClick={() => feedback === "idle" && onRemove(index)}
                disabled={feedback !== "idle"}
                className="rounded-lg border border-indigo-200 bg-white px-2.5 py-1.5 font-jp text-base text-slate-800 shadow-sm transition enabled:hover:border-indigo-400 enabled:hover:bg-indigo-50 disabled:cursor-default"
                title={feedback === "idle" ? "클릭하면 되돌립니다" : undefined}
              >
                {piece}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
