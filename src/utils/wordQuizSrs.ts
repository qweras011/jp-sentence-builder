import type { SrsCard } from "../types/srs";
import { getLocalDateString } from "./daily";
import { createNewCard, isDue, reviewCard } from "./srs";

const STORAGE_KEY = "jp-sentence-builder-word-quiz-srs";

export function vocabSrsKey(id: number): string {
  return `vocab-${id}`;
}

export function loadWordQuizCards(): Record<string, SrsCard> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SrsCard>;
  } catch {
    return {};
  }
}

export function saveWordQuizCards(cards: Record<string, SrsCard>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function reviewWord(id: number, quality: number, today = getLocalDateString()): void {
  const cards = loadWordQuizCards();
  const key = vocabSrsKey(id);
  const current = cards[key] ?? createNewCard(today);
  cards[key] = reviewCard(current, quality, today);
  saveWordQuizCards(cards);
}

export function isWordDue(id: number, today = getLocalDateString()): boolean {
  const card = loadWordQuizCards()[vocabSrsKey(id)];
  return card ? isDue(card, today) : true;
}
