import { AnswerArea } from "../components/AnswerArea";
import { GameHeader } from "../components/GameHeader";
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
    selectedPieces,
    availablePieces,
    feedback,
    playablePieceCount,
    pieceMatches,
    selectPiece,
    removePiece,
    checkAnswer,
    continueNext,
    resetAttempt,
    restart,
  } = useSentenceGame();

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-indigo-50 px-3 pb-4 pt-14 dark:from-slate-950 dark:to-slate-900">
        <main className="mx-auto max-w-2xl space-y-4">
          <GameHeader
            completed={completedCount}
            dateLabel={dateLabel}
            reviewCount={reviewCount}
            freshCount={freshCount}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">오늘 목표 달성</p>
            <h1 className="mt-2 font-kr text-2xl font-bold text-slate-900 dark:text-slate-100">
              오늘 {totalUnique}문장 완료!
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">내일 새로운 문장이 준비됩니다.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={restart}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
  const layoutPieceCount = playablePieceCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-indigo-50 pb-24 pt-14 dark:from-slate-950 dark:to-slate-900">
      <main className="mx-auto flex max-w-2xl flex-col gap-3 px-3 pb-4">
        <GameHeader
          completed={completedCount}
          dateLabel={dateLabel}
          reviewCount={reviewCount}
          freshCount={freshCount}
        />

        <PromptCard korean={current.korean} />

        <AnswerArea
          selectedPieces={selectedPieces}
          feedback={feedback}
          ruby={current.ruby}
          pieceMatches={pieceMatches}
          layoutPieceCount={layoutPieceCount}
          onRemove={removePiece}
        />

        <div>
          {isIdle ? (
            <div className="space-y-2">
              <WordBank
                pieces={availablePieces}
                disabled={false}
                onSelect={selectPiece}
                layoutPieceCount={layoutPieceCount}
              />
              <button
                type="button"
                onClick={resetAttempt}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                다시 배치
              </button>
            </div>
          ) : (
            <div className="invisible pointer-events-none space-y-2" aria-hidden="true">
              <WordBank
                pieces={availablePieces}
                disabled
                onSelect={() => undefined}
                layoutPieceCount={layoutPieceCount}
              />
              <div className="w-full rounded-xl border border-slate-300 py-2.5 text-sm">&nbsp;</div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto max-w-2xl">
          {!isIdle ? (
            <button
              type="button"
              onClick={continueNext}
              className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              다음 문제
            </button>
          ) : (
            <button
              type="button"
              onClick={checkAnswer}
              disabled={!canCheck}
              className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              정답 확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
