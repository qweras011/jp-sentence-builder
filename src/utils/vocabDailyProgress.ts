import type { VocabItem } from "../types/vocab";
import { VOCAB_DAILY_GOAL, VOCAB_DAILY_NEW, getLocalDateString } from "./daily";
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

function reviewPriority(item: VocabItem, cards: Record<string, SrsCard>, today: string): number {
  const card = cards[vocabSrsKey(item.id)];
  if (!card || !isDue(card, today)) return 0;

  let score = 200 + daysBetween(card.nextReview, today) * 10;
  if (card.repetitions === 0) score += 100;
  if (card.interval <= 1) score += 40;
  return score;
}

function countVocabReviewAndNew(
  items: VocabItem[],
  cards: Record<string, SrsCard>,
): { review: number; fresh: number } {
  let review = 0;
  let fresh = 0;

  for (const item of items) {
    if (cards[vocabSrsKey(item.id)]) review += 1;
    else fresh += 1;
  }

  return { review, fresh };
}

/** 최소 신규 VOCAB_DAILY_NEW(5)개 + 복습 우선, 부족하면 신규 추가 */
export function selectDailyVocab(
  pool: VocabItem[],
  count = VOCAB_DAILY_GOAL,
  today = getLocalDateString(),
): VocabItem[] {
  const cards = loadWordQuizCards();
  const usedIds = new Set<number>();
  const result: VocabItem[] = [];

  const newWords = pool
    .filter((item) => !cards[vocabSrsKey(item.id)])
    .sort((a, b) => a.id - b.id);

  const newTarget = Math.min(VOCAB_DAILY_NEW, count, newWords.length);
  for (let i = 0; i < newTarget; i += 1) {
    result.push(newWords[i]);
    usedIds.add(newWords[i].id);
  }

  const dueReview = pool
    .filter((item) => {
      if (usedIds.has(item.id)) return false;
      const card = cards[vocabSrsKey(item.id)];
      return card && isDue(card, today);
    })
    .sort(
      (a, b) =>
        reviewPriority(b, cards, today) - reviewPriority(a, cards, today) || a.id - b.id,
    );

  for (const item of dueReview) {
    if (result.length >= count) break;
    result.push(item);
    usedIds.add(item.id);
  }

  for (const item of newWords) {
    if (result.length >= count) break;
    if (usedIds.has(item.id)) continue;
    result.push(item);
    usedIds.add(item.id);
  }

  const filler = pool
    .filter((item) => !usedIds.has(item.id))
    .sort((a, b) => a.id - b.id);

  for (const item of filler) {
    if (result.length >= count) break;
    result.push(item);
  }

  return result;
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

  const { review, fresh } = countVocabReviewAndNew(items, cards);
  return { items, review, fresh };
}
