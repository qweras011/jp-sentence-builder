export const DAILY_GOAL = 5;

export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTodaySentences<T extends { id: number }>(
  allSentences: T[],
  count = DAILY_GOAL,
  date = new Date(),
): T[] {
  const today = getLocalDateString(date);
  const sorted = [...allSentences].sort((a, b) => {
    const hashA = hashString(`${today}-${a.id}`);
    const hashB = hashString(`${today}-${b.id}`);
    return hashA - hashB;
  });
  return sorted.slice(0, count);
}
