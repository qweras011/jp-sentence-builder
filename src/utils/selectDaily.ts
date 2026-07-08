import type { SentenceItem } from "../types/sentence";
import { SENTENCE_DAILY_GOAL, getLocalDateString, hashString } from "./daily";
import { loadCompletedSentenceIds } from "./sentenceCompleted";

const SKIP_PIECES = new Set(["。", "、", "？", "！"]);

export function isTrackablePiece(piece: string): boolean {
  return piece.length > 0 && !SKIP_PIECES.has(piece);
}

export function getTrackablePieces(pieces: string[]): string[] {
  return [...new Set(pieces.filter(isTrackablePiece))];
}

function sortByDailyHash<T extends { id: number }>(items: T[], today: string): T[] {
  return [...items].sort(
    (a, b) => hashString(`${today}-${a.id}`) - hashString(`${today}-${b.id}`),
  );
}

/** 미학습 문장 우선, 부족하면 이전에 맞힌 문장으로 채움 (SRS 없음) */
export function selectDailySentences(
  pool: SentenceItem[],
  count = SENTENCE_DAILY_GOAL,
  today = getLocalDateString(),
): SentenceItem[] {
  const completed = loadCompletedSentenceIds();
  const unseen = pool.filter((item) => !completed.has(item.id));
  const seen = pool.filter((item) => completed.has(item.id));

  const picked = sortByDailyHash(unseen, today).slice(0, count);
  if (picked.length < count) {
    const pickedIds = new Set(picked.map((item) => item.id));
    const extra = sortByDailyHash(
      seen.filter((item) => !pickedIds.has(item.id)),
      today,
    ).slice(0, count - picked.length);
    picked.push(...extra);
  }

  return picked;
}

export function countSentenceUnseenAndRepeat(sentences: SentenceItem[]): {
  unseen: number;
  repeat: number;
} {
  const completed = loadCompletedSentenceIds();
  let unseen = 0;
  let repeat = 0;

  for (const sentence of sentences) {
    if (completed.has(sentence.id)) repeat += 1;
    else unseen += 1;
  }

  return { unseen, repeat };
}
