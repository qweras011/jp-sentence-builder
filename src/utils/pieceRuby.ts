import type { RubySegment } from "../types/sentence";

export function buildRubyLookup(ruby: RubySegment[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const segment of ruby) {
    if (segment.reading) {
      map.set(segment.text, segment.reading);
    }
  }
  return map;
}

export function getPieceReading(lookup: Map<string, string>, piece: string): string | undefined {
  return lookup.get(piece);
}
