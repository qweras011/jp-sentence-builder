import { useCallback, useMemo, useState } from "react";
import data from "../data/data.json";
import type { FeedbackState, SentenceItem } from "../types/sentence";
import { SENTENCE_DAILY_GOAL, getLocalDateString } from "../utils/daily";
import { loadDailyProgress, resolveTodaySentences, saveDailyProgress } from "../utils/dailyProgress";
import { getTrackablePieces } from "../utils/selectDaily";
import { compareSentencePieces } from "../utils/sentenceCompare";
import { markSentenceCompleted } from "../utils/sentenceCompleted";
import { normalizeForAnswer, shuffle } from "../utils/shuffle";

const allPool = data as SentenceItem[];

function buildTodaySession() {
  const { sentences, unseenCount, repeatCount } = resolveTodaySentences(allPool, SENTENCE_DAILY_GOAL);
  const saved = loadDailyProgress();
  const alreadyDone = Math.min(saved.completed, SENTENCE_DAILY_GOAL);

  return {
    todaySentences: sentences,
    initialCompleted: alreadyDone,
    initialQueue: sentences.slice(alreadyDone),
    unseenCount,
    repeatCount,
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
  const [unseenCount] = useState(session.unseenCount);
  const [repeatCount] = useState(session.repeatCount);
  const [sentenceIds] = useState(session.sentenceIds);

  const totalUnique = SENTENCE_DAILY_GOAL;
  const current = queue[0];
  const isComplete = completedCount >= SENTENCE_DAILY_GOAL || queue.length === 0;

  const playablePieceCount = useMemo(
    () => (current ? getTrackablePieces(current.shuffled).length : 0),
    [current],
  );

  const shuffledPieces = useMemo(
    () => shuffle(current ? getTrackablePieces(current.shuffled) : []),
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

  const pieceMatches = useMemo(() => {
    if (feedback !== "incorrect" || !current) return null;
    return compareSentencePieces(selectedPieces, current);
  }, [feedback, current, selectedPieces]);

  const resetAttempt = useCallback(() => {
    setSelectedPieces([]);
    setFeedback("idle");
  }, []);

  const selectPiece = useCallback(
    (piece: string) => {
      if (feedback !== "idle") return;
      setSelectedPieces((prev) => [...prev, piece]);
    },
    [feedback],
  );

  const removePiece = useCallback(
    (index: number) => {
      if (feedback !== "idle") return;
      setSelectedPieces((prev) => prev.filter((_, i) => i !== index));
    },
    [feedback],
  );

  const checkAnswer = useCallback(() => {
    if (!current || selectedPieces.length === 0) return;

    const userAnswer = normalizeForAnswer(selectedPieces.join(""));
    const correctAnswer = normalizeForAnswer(current.japanese);

    if (userAnswer === correctAnswer) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  }, [current, selectedPieces]);

  const continueNext = useCallback(() => {
    if (feedback === "idle") return;

    if (feedback === "correct") {
      if (current) markSentenceCompleted(current.id);
      setQueue((prev) => prev.slice(1));
      setCompletedCount((count) => {
        const next = Math.min(count + 1, SENTENCE_DAILY_GOAL);
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
    setShuffleSeed((seed) => seed + 1);
  }, [feedback, sentenceIds, current]);

  const restart = useCallback(() => {
    const { sentences } = resolveTodaySentences(allPool, SENTENCE_DAILY_GOAL);
    setQueue([...sentences]);
    setCompletedCount(0);
    saveDailyProgress(0, sentences.map((s) => s.id));
    setSelectedPieces([]);
    setFeedback("idle");
    setShuffleSeed((seed) => seed + 1);
  }, []);

  return {
    current,
    completedCount,
    totalUnique,
    playablePieceCount,
    remainingCount: queue.length,
    isComplete,
    dateLabel,
    unseenCount,
    repeatCount,
    selectedPieces,
    availablePieces,
    feedback,
    pieceMatches,
    selectPiece,
    removePiece,
    checkAnswer,
    continueNext,
    resetAttempt,
    restart,
  };
}
