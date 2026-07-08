import { SENTENCE_DAILY_GOAL, getLocalDateString } from "./daily";
import type { SentenceItem } from "../types/sentence";
import { countSentenceUnseenAndRepeat, selectDailySentences } from "./selectDaily";

const STORAGE_KEY = "jp-sentence-builder-daily-progress";

interface DailyProgress {
  date: string;
  completed: number;
  sentenceIds: number[];
}

function emptyProgress(date: string): DailyProgress {
  return { date, completed: 0, sentenceIds: [] };
}

export function loadDailyProgress(): DailyProgress {
  const today = getLocalDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress(today);
    const parsed = JSON.parse(raw) as DailyProgress;
    if (parsed.date !== today) return emptyProgress(today);
    return {
      date: today,
      completed: parsed.completed ?? 0,
      sentenceIds: parsed.sentenceIds ?? [],
    };
  } catch {
    return emptyProgress(today);
  }
}

export function saveDailyProgress(completed: number, sentenceIds: number[]): void {
  const progress: DailyProgress = {
    date: getLocalDateString(),
    completed,
    sentenceIds,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resolveTodaySentences(
  pool: SentenceItem[],
  count = SENTENCE_DAILY_GOAL,
): { sentences: SentenceItem[]; unseenCount: number; repeatCount: number } {
  const saved = loadDailyProgress();
  const today = getLocalDateString();

  let sentences: SentenceItem[];

  if (saved.sentenceIds.length > 0) {
    sentences = saved.sentenceIds
      .map((id) => pool.find((item) => item.id === id))
      .filter((item): item is SentenceItem => Boolean(item));

    if (sentences.length < count) {
      const picked = selectDailySentences(pool, count, today);
      sentences = picked;
      saveDailyProgress(saved.completed, picked.map((s) => s.id));
    }
  } else {
    sentences = selectDailySentences(pool, count, today);
    saveDailyProgress(0, sentences.map((s) => s.id));
  }

  const { unseen, repeat } = countSentenceUnseenAndRepeat(sentences);
  return { sentences, unseenCount: unseen, repeatCount: repeat };
}
