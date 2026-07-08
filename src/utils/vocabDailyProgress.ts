import type { VocabItem } from "../types/vocab";
import { VOCAB_DAILY_GOAL, getLocalDateString } from "./daily";
import type { SrsCard } from "../types/srs";
import { daysBetween, isDue } from "./srs";
import { loadWordQuizCards, vocabSrsKey } from "./wordQuizSrs";

const STORAGE_KEY = "jp-sentence-builder-vocab-daily-progress";

interface VocabDailyProgress {
  date: string;
  completed: number;
  vocabIds: number[];
}

function emptyProgress(date: string): VocabDailyProgress {
  return { date, completed: 0, vocabIds: [] };
}

export function loadVocabDailyProgress(): VocabDailyProgress {
  const today = getLocalDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress(today);
    const parsed = JSON.parse(raw) as VocabDailyProgress;
    if (parsed.date !== today) return emptyProgress(today);
    return {
      date: today,
      completed: parsed.completed ?? 0,
      vocabIds: parsed.vocabIds ?? [],
    };
  } catch {
    return emptyProgress(today);
  }
}

export function saveVocabDailyProgress(completed: number, vocabIds: number[]): void {
  const progress: VocabDailyProgress = {
    date: getLocalDateString(),
    completed,
    vocabIds,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function vocabPriority(item: VocabItem, cards: Record<string, SrsCard>, today: string): number {
  const card = cards[vocabSrsKey(item.id)];
  if (!card) return 100;
  if (isDue(card, today)) return 200 + daysBetween(card.nextReview, today) * 10;
  return 10;
}

function countVocabReviewAndNew(
  items: VocabItem[],
  cards: Record<string, SrsCard>,
  today: string,
): { review: number; fresh: number } {
  let review = 0;
  let fresh = 0;

  for (const item of items) {
    const card = cards[vocabSrsKey(item.id)];
    if (!card) fresh += 1;
    else if (isDue(card, today)) review += 1;
    else review += 1;
  }

  return { review, fresh };
}

export function selectDailyVocab(
  pool: VocabItem[],
  count = VOCAB_DAILY_GOAL,
  today = getLocalDateString(),
): VocabItem[] {
  const cards = loadWordQuizCards();
  const ranked = [...pool].sort((a, b) => {
    const diff = vocabPriority(b, cards, today) - vocabPriority(a, cards, today);
    return diff !== 0 ? diff : a.id - b.id;
  });
  return ranked.slice(0, count);
}

export function resolveTodayVocab(
  pool: VocabItem[],
  count = VOCAB_DAILY_GOAL,
): { items: VocabItem[]; review: number; fresh: number } {
  const saved = loadVocabDailyProgress();
  const cards = loadWordQuizCards();
  const today = getLocalDateString();

  let items: VocabItem[];

  if (saved.vocabIds.length > 0) {
    items = saved.vocabIds
      .map((id) => pool.find((item) => item.id === id))
      .filter((item): item is VocabItem => Boolean(item));

    if (items.length < count) {
      items = selectDailyVocab(pool, count, today);
      saveVocabDailyProgress(saved.completed, items.map((item) => item.id));
    }
  } else {
    items = selectDailyVocab(pool, count, today);
    saveVocabDailyProgress(0, items.map((item) => item.id));
  }

  const { review, fresh } = countVocabReviewAndNew(items, cards, today);
  return { items, review, fresh };
}
