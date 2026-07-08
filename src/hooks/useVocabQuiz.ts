import { useCallback, useEffect, useMemo, useState } from "react";
import { getVocabPool } from "../data/vocab";
import type { VocabDirection, VocabFeedback, VocabItem } from "../types/vocab";
import { VOCAB_DAILY_GOAL, getLocalDateString } from "../utils/daily";
import { buildVocabChoices } from "../utils/vocabChoices";
import {
  loadVocabDailyProgress,
  resolveTodayVocab,
  saveVocabDailyProgress,
} from "../utils/vocabDailyProgress";
import { reviewWord, reviewWordWrong } from "../utils/wordQuizSrs";

const allPool = getVocabPool();

function buildTodaySession() {
  const { items, review, fresh } = resolveTodayVocab(allPool, VOCAB_DAILY_GOAL);
  const saved = loadVocabDailyProgress();
  const alreadyDone = Math.min(saved.completed, VOCAB_DAILY_GOAL);

  return {
    todayItems: items,
    initialCompleted: alreadyDone,
    initialQueue: items.slice(alreadyDone),
    reviewCount: review,
    freshCount: fresh,
    vocabIds: items.map((item) => item.id),
  };
}

const AUTO_ADVANCE_MS = 700;

export function useVocabQuiz(direction: VocabDirection) {
  const session = useMemo(() => buildTodaySession(), []);
  const dateLabel = getLocalDateString();

  const [queue, setQueue] = useState<VocabItem[]>(() => [...session.initialQueue]);
  const [completedCount, setCompletedCount] = useState(session.initialCompleted);
  const [feedback, setFeedback] = useState<VocabFeedback>("idle");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [choiceSeed, setChoiceSeed] = useState(0);
  const [activeDirection, setActiveDirection] = useState<VocabDirection>(direction);
  const [reviewCount] = useState(session.reviewCount);
  const [freshCount] = useState(session.freshCount);
  const [vocabIds] = useState(session.vocabIds);

  const totalUnique = VOCAB_DAILY_GOAL;
  const current = queue[0];
  const isComplete = completedCount >= VOCAB_DAILY_GOAL || queue.length === 0;

  useEffect(() => {
    setActiveDirection(direction);
  }, [current?.id]);

  const choices = useMemo(
    () => (current ? buildVocabChoices(current, allPool, activeDirection) : []),
    [current, choiceSeed, activeDirection],
  );

  const selectChoice = useCallback(
    (label: string, isCorrect: boolean) => {
      if (!current || feedback !== "idle") return;

      setSelectedLabel(label);
      if (isCorrect) {
        reviewWord(current.id, 5);
        setFeedback("correct");
      } else {
        reviewWordWrong(current.id);
        setFeedback("incorrect");
      }
    },
    [current, feedback],
  );

  const continueNext = useCallback(() => {
    if (feedback === "idle") return;

    if (feedback === "correct") {
      setQueue((prev) => prev.slice(1));
      setCompletedCount((count) => {
        const next = Math.min(count + 1, VOCAB_DAILY_GOAL);
        saveVocabDailyProgress(next, vocabIds);
        return next;
      });
    } else {
      setQueue((prev) => {
        if (prev.length <= 1) return prev;
        return [...prev.slice(1), prev[0]];
      });
    }

    setFeedback("idle");
    setSelectedLabel(null);
    setChoiceSeed((seed) => seed + 1);
  }, [feedback, vocabIds]);

  useEffect(() => {
    if (feedback === "idle") return;

    const timer = window.setTimeout(() => {
      continueNext();
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [feedback, continueNext]);

  const restart = useCallback(() => {
    const { items } = resolveTodayVocab(allPool, VOCAB_DAILY_GOAL);
    setQueue([...items]);
    setCompletedCount(0);
    saveVocabDailyProgress(0, items.map((item) => item.id));
    setFeedback("idle");
    setSelectedLabel(null);
    setChoiceSeed((seed) => seed + 1);
  }, []);

  return {
    current,
    choices,
    activeDirection,
    completedCount,
    totalUnique,
    remainingCount: queue.length,
    isComplete,
    dateLabel,
    reviewCount,
    freshCount,
    feedback,
    selectedLabel,
    selectChoice,
    restart,
  };
}
