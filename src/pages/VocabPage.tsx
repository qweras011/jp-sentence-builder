import { FuriganaText } from "../components/FuriganaText";
import { VocabHeader } from "../components/VocabHeader";
import { useVocabQuiz } from "../hooks/useVocabQuiz";

interface VocabPageProps {
  onHome: () => void;
}

export function VocabPage({ onHome }: VocabPageProps) {
  const {
    current,
    choices,
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
  } = useVocabQuiz();

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-emerald-50 px-3 py-4">
        <main className="mx-auto max-w-2xl space-y-4">
          <VocabHeader
            completed={completedCount}
            dateLabel={dateLabel}
            reviewCount={reviewCount}
            freshCount={freshCount}
            onHome={onHome}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-emerald-600">오늘 목표 달성</p>
            <h1 className="mt-2 font-kr text-2xl font-bold text-slate-900">
              오늘 {totalUnique}단어 완료!
            </h1>
            <p className="mt-2 text-sm text-slate-600">내일 새로운 단어가 준비됩니다.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={restart}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-emerald-50 px-3 py-4">
      <main className="mx-auto max-w-2xl space-y-4">
        <VocabHeader
          completed={completedCount}
          dateLabel={dateLabel}
          reviewCount={reviewCount}
          freshCount={freshCount}
          onHome={onHome}
        />

        <p className="text-center text-xs text-slate-500">
          문제 {questionNumber} / {totalUnique}
        </p>
        <p className="text-center text-sm text-slate-600">
          일본어 단어를 보고, 알맞은 뜻을 고르세요.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center shadow-sm">
          <FuriganaText
            segments={[{ text: current.word, reading: current.reading }]}
            className="text-4xl font-medium"
          />
        </div>

        <div className="space-y-2.5">
          {choices.map((choice) => {
            const isSelected = selectedLabel === choice.label;
            let style =
              "border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50";

            if (answered && choice.isCorrect) {
              style = "border-emerald-400 bg-emerald-50 text-emerald-900";
            } else if (answered && isSelected && !choice.isCorrect) {
              style = "border-rose-400 bg-rose-50 text-rose-900";
            } else if (answered) {
              style = "border-slate-200 bg-slate-50 text-slate-400";
            }

            let badgeStyle = "bg-slate-100 text-slate-600";
            if (answered && choice.isCorrect) {
              badgeStyle = "bg-emerald-100 text-emerald-700";
            } else if (answered && isSelected && !choice.isCorrect) {
              badgeStyle = "bg-rose-100 text-rose-700";
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
                <span>{choice.korean}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <p
            className={`text-center text-sm font-semibold ${
              feedback === "correct" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {feedback === "correct" ? "정답입니다!" : "틀렸습니다. 다시 복습해요."}
          </p>
        )}
      </main>
    </div>
  );
}
