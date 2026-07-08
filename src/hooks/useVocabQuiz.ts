import { useCallback, useMemo, useState } from "react";
import vocabData from "../data/vocab.json";
import type { VocabFeedback, VocabItem } from "../types/vocab";
import { VOCAB_DAILY_GOAL, getLocalDateString } from "../utils/daily";
import { buildVocabChoices } from "../utils/vocabChoices";
import {
  loadVocabDailyProgress,
  resolveTodayVocab,
  saveVocabDailyProgress,
} from "../utils/vocabDailyProgress";
import { reviewWord } from "../utils/wordQuizSrs";

const allPool = vocabData as VocabItem[];

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

export function useVocabQuiz() {
  const session = useMemo(() => buildTodaySession(), []);
  const dateLabel = getLocalDateString();

  const [queue, setQueue] = useState<VocabItem[]>(() => [...session.initialQueue]);
  const [completedCount, setCompletedCount] = useState(session.initialCompleted);
  const [feedback, setFeedback] = useState<VocabFeedback>("idle");
  const [choiceSeed, setChoiceSeed] = useState(0);
  const [reviewCount] = useState(session.reviewCount);
  const [freshCount] = useState(session.freshCount);
  const [vocabIds] = useState(session.vocabIds);

  const totalUnique = VOCAB_DAILY_GOAL;
  const current = queue[0];
  const isComplete = completedCount >= VOCAB_DAILY_GOAL || queue.length === 0;

  const choices = useMemo(
    () => (current ? buildVocabChoices(current, allPool) : []),
    [current, choiceSeed],
  );

  const selectChoice = useCallback(
    (isCorrect: boolean) => {
      if (!current || feedback !== "idle") return;

      reviewWord(current.id, isCorrect ? 5 : 1);
      setFeedback(isCorrect ? "correct" : "incorrect");
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
    setChoiceSeed((seed) => seed + 1);
  }, [feedback, vocabIds]);

  const restart = useCallback(() => {
    const { items } = resolveTodayVocab(allPool, VOCAB_DAILY_GOAL);
    setQueue([...items]);
    setCompletedCount(0);
    saveVocabDailyProgress(0, items.map((item) => item.id));
    setFeedback("idle");
    setChoiceSeed((seed) => seed + 1);
  }, []);

  return {
    current,
    choices,
    completedCount,
    totalUnique,
    remainingCount: queue.length,
    isComplete,
    dateLabel,
    reviewCount,
    freshCount,
    feedback,
    selectChoice,
    continueNext,
    restart,
  };
}
