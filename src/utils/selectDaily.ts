import type { SentenceItem } from "../types/sentence";
import type { SrsCard } from "../types/srs";
import { SENTENCE_DAILY_GOAL, getLocalDateString } from "./daily";
import { daysBetween, isDue } from "./srs";

const SKIP_PIECES = new Set(["。", "、", "？", "！"]);

export function isTrackablePiece(piece: string): boolean {
  return piece.length > 0 && !SKIP_PIECES.has(piece);
}

export function getTrackablePieces(pieces: string[]): string[] {
  return [...new Set(pieces.filter(isTrackablePiece))];
}

export function sentencePriority(
  sentence: SentenceItem,
  cards: Record<string, SrsCard>,
  today = getLocalDateString(),
): number {
  const pieces = getTrackablePieces(sentence.shuffled);
  if (pieces.length === 0) return 0;

  let score = 0;
  for (const piece of pieces) {
    const card = cards[piece];
    if (!card) {
      score += 40;
      continue;
    }
    if (isDue(card, today)) {
      score += 120 + daysBetween(card.nextReview, today) * 15;
    } else {
      score += 5;
    }
  }

  return score / pieces.length;
}

export function countReviewAndNew(
  sentences: SentenceItem[],
  cards: Record<string, SrsCard>,
  today = getLocalDateString(),
): { review: number; fresh: number } {
  let review = 0;
  let fresh = 0;

  for (const sentence of sentences) {
    const pieces = getTrackablePieces(sentence.shuffled);
    const hasDue = pieces.some((piece) => {
      const card = cards[piece];
      return card ? isDue(card, today) : false;
    });
    const hasNew = pieces.some((piece) => !cards[piece]);

    if (hasDue) review += 1;
    else if (hasNew) fresh += 1;
    else review += 1;
  }

  return { review, fresh };
}

export function selectDailySentences(
  pool: SentenceItem[],
  cards: Record<string, SrsCard>,
  count = SENTENCE_DAILY_GOAL,
  today = getLocalDateString(),
): SentenceItem[] {
  const ranked = [...pool].sort((a, b) => {
    const diff = sentencePriority(b, cards, today) - sentencePriority(a, cards, today);
    return diff !== 0 ? diff : a.id - b.id;
  });

  return ranked.slice(0, count);
}
