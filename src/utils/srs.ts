import type { SrsCard } from "../types/srs";
import { DEFAULT_EASE } from "../types/srs";
import { getLocalDateString } from "./daily";

export function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

export function daysBetween(from: string, to: string): number {
  const start = new Date(`${from}T00:00:00`).getTime();
  const end = new Date(`${to}T00:00:00`).getTime();
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

export function createNewCard(date = getLocalDateString()): SrsCard {
  return {
    easeFactor: DEFAULT_EASE,
    interval: 0,
    repetitions: 0,
    nextReview: date,
    lastReview: date,
  };
}

export function isDue(card: SrsCard, today = getLocalDateString()): boolean {
  return card.nextReview <= today;
}

/** SM-2 알고리즘 (망각곡선 기반 간격 반복) */
export function reviewCard(
  card: SrsCard,
  quality: number,
  today = getLocalDateString(),
): SrsCard {
  const q = Math.max(0, Math.min(5, quality));

  if (q < 3) {
    return {
      easeFactor: Math.max(1.3, card.easeFactor - 0.2),
      interval: 1,
      repetitions: 0,
      nextReview: addDays(today, 1),
      lastReview: today,
    };
  }

  let interval: number;
  if (card.repetitions === 0) interval = 1;
  else if (card.repetitions === 1) interval = 3;
  else interval = Math.max(1, Math.round(card.interval * card.easeFactor));

  const easeFactor = Math.max(
    1.3,
    card.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  );

  return {
    easeFactor,
    interval,
    repetitions: card.repetitions + 1,
    nextReview: addDays(today, interval),
    lastReview: today,
  };
}
