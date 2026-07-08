import type { SrsCard } from "../types/srs";
import { getLocalDateString } from "./daily";
import { createNewCard, reviewCard } from "./srs";
import { getTrackablePieces, isTrackablePiece } from "./selectDaily";

const STORAGE_KEY = "jp-sentence-builder-srs-cards";

export function loadSrsCards(): Record<string, SrsCard> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SrsCard>;
  } catch {
    return {};
  }
}

export function saveSrsCards(cards: Record<string, SrsCard>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function reviewPieces(
  pieces: string[],
  quality: number,
  today = getLocalDateString(),
): Record<string, SrsCard> {
  const cards = loadSrsCards();
  const unique = [...new Set(pieces.filter(isTrackablePiece))];

  for (const piece of unique) {
    const current = cards[piece] ?? createNewCard(today);
    cards[piece] = reviewCard(current, quality, today);
  }

  saveSrsCards(cards);
  return cards;
}

export function getDueWordCount(today = getLocalDateString()): number {
  const cards = loadSrsCards();
  return Object.keys(cards).filter((key) => cards[key].nextReview <= today).length;
}

export function getTrackedWordCount(): number {
  return Object.keys(loadSrsCards()).length;
}

export function getPiecesFromSentence(pieces: string[]): string[] {
  return getTrackablePieces(pieces);
}
