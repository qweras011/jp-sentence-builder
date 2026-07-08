import { useCallback, useMemo, useState } from "react";
import data from "../data/data.json";
import type { FeedbackState, SentenceItem } from "../types/sentence";
import { DAILY_GOAL, getLocalDateString } from "../utils/daily";
import { loadDailyProgress, resolveTodaySentences, saveDailyProgress } from "../utils/dailyProgress";
import { getMeaningCheckItems, type MeaningRating } from "../utils/meaningCheck";
import { normalizeJapanese, shuffle } from "../utils/shuffle";
import { reviewPiecesWithRatings } from "../utils/vocabSrs";

const allPool = data as SentenceItem[];

function buildTodaySession() {
  const { sentences, review, fresh } = resolveTodaySentences(allPool, DAILY_GOAL);
  const saved = loadDailyProgress();
  const alreadyDone = Math.min(saved.completed, DAILY_GOAL);

  return {
    todaySentences: sentences,
    initialCompleted: alreadyDone,
    initialQueue: sentences.slice(alreadyDone),
    reviewCount: review,
    freshCount: fresh,
    sentenceIds: sentences.map((s) => s.id),
  };
}

export function useSentenceGame() {
  const session = useMemo(() => buildTodaySession(), []);
  const dateLabel = getLocalDateString();

  const [queue, setQueue] = useState<SentenceItem[]>(() => [...session.initialQueue]);
  const [completedCount, setCompletedCount] = useState(session.initialCompleted);
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [wordRatings, setWordRatings] = useState<Record<string, MeaningRating | undefined>>({});
  const [reviewCount] = useState(session.reviewCount);
  const [freshCount] = useState(session.freshCount);
  const [sentenceIds] = useState(session.sentenceIds);

  const totalUnique = DAILY_GOAL;
  const current = queue[0];
  const isComplete = completedCount >= DAILY_GOAL || queue.length === 0;

  const meaningItems = useMemo(
    () => (current ? getMeaningCheckItems(current.ruby) : []),
    [current],
  );

  const allWordsRated = meaningItems.every((item) => wordRatings[item.text] !== undefined);

  const shuffledPieces = useMemo(
    () => shuffle(current?.shuffled ?? []),
    [current, shuffleSeed],
  );

  const availablePieces = useMemo(() => {
    const remaining = [...shuffledPieces];
    for (const piece of selectedPieces) {
      const index = remaining.indexOf(piece);
      if (index !== -1) remaining.splice(index, 1);
    }
    return remaining;
  }, [selectedPieces, shuffledPieces]);

  const resetAttempt = useCallback(() => {
    setSelectedPieces([]);
    setFeedback("idle");
    setWordRatings({});
    setShuffleSeed((seed) => seed + 1);
  }, []);

  const selectPiece = useCallback(
    (piece: string) => {
      if (feedback === "correct") return;
      setSelectedPieces((prev) => [...prev, piece]);
      setFeedback("idle");
    },
    [feedback],
  );

  const removePiece = useCallback(
    (index: number) => {
      if (feedback === "correct") return;
      setSelectedPieces((prev) => prev.filter((_, i) => i !== index));
      setFeedback("idle");
    },
    [feedback],
  );

  const checkAnswer = useCallback(() => {
    if (!current || selectedPieces.length === 0) return;

    const userAnswer = normalizeJapanese(selectedPieces.join(""));
    const correctAnswer = normalizeJapanese(current.japanese);

    setWordRatings({});
    if (userAnswer === correctAnswer) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  }, [current, selectedPieces]);

  const rateWord = useCallback((word: string, rating: MeaningRating) => {
    setWordRatings((prev) => ({ ...prev, [word]: rating }));
  }, []);

  const advanceQueue = useCallback(() => {
    if (feedback === "correct") {
      setQueue((prev) => prev.slice(1));
      setCompletedCount((count) => {
        const next = Math.min(count + 1, DAILY_GOAL);
        saveDailyProgress(next, sentenceIds);
        return next;
      });
    } else {
      setQueue((prev) => {
        if (prev.length <= 1) return prev;
        return [...prev.slice(1), prev[0]];
      });
    }

    setSelectedPieces([]);
    setFeedback("idle");
    setWordRatings({});
    setShuffleSeed((seed) => seed + 1);
  }, [feedback, sentenceIds]);

  const continueAfterMeaning = useCallback(() => {
    if (!allWordsRated) return;

    const ratings = Object.fromEntries(
      meaningItems.map((item) => [item.text, wordRatings[item.text] as number]),
    );
    reviewPiecesWithRatings(ratings);
    advanceQueue();
  }, [advanceQueue, allWordsRated, meaningItems, wordRatings]);

  const restart = useCallback(() => {
    const { sentences } = resolveTodaySentences(allPool, DAILY_GOAL);
    setQueue([...sentences]);
    setCompletedCount(0);
    saveDailyProgress(0, sentences.map((s) => s.id));
    setSelectedPieces([]);
    setFeedback("idle");
    setWordRatings({});
    setShuffleSeed((seed) => seed + 1);
  }, []);

  return {
    current,
    completedCount,
    totalUnique,
    remainingCount: queue.length,
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
  };
}
