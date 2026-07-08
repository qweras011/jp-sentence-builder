import { AnswerArea } from "../components/AnswerArea";
import { GameHeader } from "../components/GameHeader";
import { MeaningCheck } from "../components/MeaningCheck";
import { PromptCard } from "../components/PromptCard";
import { WordBank } from "../components/WordBank";
import { useSentenceGame } from "../hooks/useSentenceGame";

interface GamePageProps {
  onHome: () => void;
}

export function GamePage({ onHome }: GamePageProps) {
  const {
    current,
    completedCount,
    totalUnique,
    isComplete,
    dateLabel,
    reviewCount,
    freshCount,
    meaningItems,
    wordRatings,
    allWordsRated,
    selectedPieces,
    availablePieces,
    feedback,
    selectPiece,
    removePiece,
    checkAnswer,
    rateWord,
    continueAfterMeaning,
    resetAttempt,
    restart,
  } = useSentenceGame();

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-indigo-50 px-3 py-4">
        <main className="mx-auto max-w-2xl space-y-4">
          <GameHeader
            completed={completedCount}
            dateLabel={dateLabel}
            reviewCount={reviewCount}
            freshCount={freshCount}
            onHome={onHome}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-indigo-600">오늘 목표 달성</p>
            <h1 className="mt-2 font-kr text-2xl font-bold text-slate-900">
              오늘 {totalUnique}문장 완료!
            </h1>
            <p className="mt-2 text-sm text-slate-600">내일 새로운 문장이 준비됩니다.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={restart}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                오늘 문장 다시 복습
              </button>
              <button
                type="button"
                onClick={onHome}
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600"
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

  const isIdle = feedback === "idle";
  const canCheck = selectedPieces.length > 0 && isIdle;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-indigo-50 px-3 py-4">
      <main className="mx-auto flex max-w-2xl flex-col gap-3">
        <GameHeader
          completed={completedCount}
          dateLabel={dateLabel}
          reviewCount={reviewCount}
          freshCount={freshCount}
          onHome={onHome}
        />

        <PromptCard korean={current.korean} />

        <AnswerArea
          selectedPieces={selectedPieces}
          feedback={feedback}
          ruby={current.ruby}
          onRemove={removePiece}
        />

        {isIdle && (
          <WordBank pieces={availablePieces} disabled={false} onSelect={selectPiece} />
        )}

        {!isIdle && (
          <MeaningCheck items={meaningItems} ratings={wordRatings} onRate={rateWord} />
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {!isIdle ? (
            <button
              type="button"
              onClick={continueAfterMeaning}
              disabled={!allWordsRated}
              className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 문제
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={checkAnswer}
                disabled={!canCheck}
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                정답 확인
              </button>
              <button
                type="button"
                onClick={resetAttempt}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                다시 배치
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
