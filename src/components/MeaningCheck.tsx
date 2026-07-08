import type { MeaningCheckItem, MeaningRating } from "../utils/meaningCheck";
import { MEANING_LABELS } from "../utils/meaningCheck";

interface MeaningCheckProps {
  items: MeaningCheckItem[];
  ratings: Record<string, MeaningRating | undefined>;
  onRate: (word: string, rating: MeaningRating) => void;
}

export function MeaningCheck({ items, ratings, onRate }: MeaningCheckProps) {
  const allRated = items.every((item) => ratings[item.text] !== undefined);

  return (
    <section className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5">
      <p className="text-sm font-semibold text-violet-900">뜻 확인</p>
      <p className="mt-0.5 text-xs text-violet-700">
        단어와 조사 용법을 솔직하게 체크해 주세요.
      </p>

      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item.text} className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-jp text-base font-medium text-slate-900">
                  {item.text}
                </span>
                {item.kind === "particle" && (
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-700">
                    조사
                  </span>
                )}
              </div>
              {item.hint && (
                <p className="text-[11px] text-slate-500">{item.hint}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              {([5, 3, 1] as MeaningRating[]).map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onRate(item.text, rating)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                    ratings[item.text] === rating
                      ? rating === 5
                        ? "bg-emerald-500 text-white"
                        : rating === 3
                          ? "bg-amber-400 text-white"
                          : "bg-rose-500 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {MEANING_LABELS[rating]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {!allRated && (
        <p className="mt-2 text-xs text-violet-600">
          모든 항목을 선택해야 다음으로 넘어갈 수 있어요.
        </p>
      )}
    </section>
  );
}
