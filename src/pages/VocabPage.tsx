import { FuriganaText } from "../components/FuriganaText";
import { VocabHeader } from "../components/VocabHeader";
import { useVocabDirection } from "../hooks/useVocabDirection";
import { useVocabQuiz } from "../hooks/useVocabQuiz";

interface VocabPageProps {
  onHome: () => void;
  showFurigana: boolean;
}

export function VocabPage({ onHome, showFurigana }: VocabPageProps) {
  const { direction, setVocabDirection } = useVocabDirection();
  const {
    current,
    choices,
    activeDirection,
    completedCount,
    totalUnique,
    isComplete,
    dateLabel,
    reviewCount,
    freshCount,
    feedback,
    selectedLabel,
    selectChoice,
    restart,
  } = useVocabQuiz(direction);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-emerald-50 px-3 pb-4 pt-14 dark:from-slate-950 dark:to-slate-900">
        <main className="mx-auto max-w-2xl space-y-4">
          <VocabHeader
            completed={completedCount}
            dateLabel={dateLabel}
            reviewCount={reviewCount}
            freshCount={freshCount}
            direction={direction}
            onDirectionChange={setVocabDirection}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">오늘 목표 달성</p>
            <h1 className="mt-2 font-kr text-2xl font-bold text-slate-900 dark:text-slate-100">
              오늘 {totalUnique}단어 완료!
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">내일 새로운 단어가 준비됩니다.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={restart}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                오늘 단어 다시 복습
              </button>
              <button
                type="button"
                onClick={onHome}
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                홈으로
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!current) return null;

  const answered = feedback !== "idle";
  const questionNumber = completedCount + 1;
  const isReverse = activeDirection === "reverse";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-emerald-50 px-3 pb-4 pt-14 dark:from-slate-950 dark:to-slate-900">
      <main className="mx-auto max-w-2xl space-y-4">
        <VocabHeader
          completed={completedCount}
          dateLabel={dateLabel}
          reviewCount={reviewCount}
          freshCount={freshCount}
          direction={direction}
          onDirectionChange={setVocabDirection}
        />

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          문제 {questionNumber} / {totalUnique}
        </p>
        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          {isReverse
            ? "한국어 뜻을 보고, 알맞은 일본어를 고르세요."
            : "일본어 단어를 보고, 알맞은 뜻을 고르세요."}
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {isReverse ? (
            <p className="font-kr text-3xl font-bold text-slate-900 dark:text-slate-100">
              {current.korean}
            </p>
          ) : (
            <FuriganaText
              segments={[{ text: current.word, reading: current.reading }]}
              className="text-4xl font-medium"
              showFurigana={showFurigana}
            />
          )}
        </div>

        <div className="space-y-2.5">
          {choices.map((choice) => {
            const isSelected = selectedLabel === choice.label;
            let style =
              "border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-emerald-600 dark:hover:bg-emerald-950";

            if (answered && choice.isCorrect) {
              style =
                "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-200";
            } else if (answered && isSelected && !choice.isCorrect) {
              style =
                "border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950 dark:text-rose-200";
            } else if (answered) {
              style =
                "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500";
            }

            let badgeStyle = "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
            if (answered && choice.isCorrect) {
              badgeStyle = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300";
            } else if (answered && isSelected && !choice.isCorrect) {
              badgeStyle = "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300";
            }

            return (
              <button
                key={choice.label}
                type="button"
                disabled={answered}
                onClick={() => selectChoice(choice.label, choice.isCorrect)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left text-base font-medium transition ${style} disabled:cursor-default`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${badgeStyle}`}
                >
                  {choice.label}
                </span>
                {isReverse ? (
                  <FuriganaText
                    segments={[{ text: choice.word, reading: choice.reading }]}
                    className="text-lg"
                    showFurigana={showFurigana}
                  />
                ) : (
                  <span>{choice.korean}</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <p
            className={`text-center text-sm font-semibold ${
              feedback === "correct"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {feedback === "correct" ? "정답입니다!" : "틀렸습니다. 다시 복습해요."}
          </p>
        )}
      </main>
    </div>
  );
}
