const STORAGE_KEY = "jp-sentence-builder-completed-sentences";

export function loadCompletedSentenceIds(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

export function markSentenceCompleted(id: number): void {
  const ids = loadCompletedSentenceIds();
  ids.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}
