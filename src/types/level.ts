export const JLPT_LEVELS = ["n5", "n4", "n3", "n2", "n1"] as const;

export type JlptLevel = (typeof JLPT_LEVELS)[number];

export const JLPT_LABELS: Record<JlptLevel, string> = {
  n5: "N5",
  n4: "N4",
  n3: "N3",
  n2: "N2",
  n1: "N1",
};

export function isJlptLevel(value: string): value is JlptLevel {
  return JLPT_LEVELS.includes(value as JlptLevel);
}
