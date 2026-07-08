export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function normalizeJapanese(text: string): string {
  return text.replace(/\s+/g, "");
}

/** 문장 배열 게임에서 제외하는 구두점 */
export function stripPunctuation(text: string): string {
  return text.replace(/[。、？！]/g, "");
}

export function normalizeForAnswer(text: string): string {
  return normalizeJapanese(stripPunctuation(text));
}
