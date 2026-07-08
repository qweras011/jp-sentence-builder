import type { RubySegment } from "../types/sentence";
import { isTrackablePiece } from "./selectDaily";

const KANJI_PATTERN = /[\u4e00-\u9faf]/;

const PARTICLE_HINTS: Record<string, string> = {
  は: "주제 (~은/는)",
  が: "주어 (~이/가)",
  を: "목적어 (~을/를)",
  に: "시간·방향·목적 (~에)",
  で: "장소·수단 (~에서/로)",
  へ: "방향 (~쪽으로)",
  と: "와/과, ~와 함께",
  も: "도 (~도)",
  の: "소유·연결 (~의)",
  から: "~부터",
  まで: "~까지",
  ので: "이유 (~해서/이므로)",
  より: "~보다",
};

export interface MeaningCheckItem {
  text: string;
  kind: "word" | "particle";
  hint?: string;
}

export function getMeaningCheckItems(ruby: RubySegment[]): MeaningCheckItem[] {
  const items: MeaningCheckItem[] = [];
  const seen = new Set<string>();

  for (const segment of ruby) {
    const text = segment.text;
    if (!isTrackablePiece(text)) continue;

    if (PARTICLE_HINTS[text]) {
      if (!seen.has(`p:${text}`)) {
        items.push({
          text,
          kind: "particle",
          hint: PARTICLE_HINTS[text],
        });
        seen.add(`p:${text}`);
      }
      continue;
    }

    if (KANJI_PATTERN.test(text) && !seen.has(`w:${text}`)) {
      items.push({ text, kind: "word" });
      seen.add(`w:${text}`);
    }
  }

  if (items.length === 0) {
    return ruby
      .map((segment) => segment.text)
      .filter(isTrackablePiece)
      .filter((text, index, arr) => arr.indexOf(text) === index)
      .slice(0, 4)
      .map((text) => ({ text, kind: "word" as const }));
  }

  return items.slice(0, 8);
}

export type MeaningRating = 5 | 3 | 1;

export const MEANING_LABELS: Record<MeaningRating, string> = {
  5: "알아요",
  3: "헷갈림",
  1: "몰라요",
};
