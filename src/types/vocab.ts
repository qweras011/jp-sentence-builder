export type VocabDirection = "forward" | "reverse";

export type VocabLevel = "n3" | "n4";

export interface VocabItem {
  id: number;
  word: string;
  reading: string;
  korean: string;
  level: VocabLevel;
}

export type VocabFeedback = "idle" | "correct" | "incorrect";

export interface VocabChoice {
  label: string;
  korean: string;
  word: string;
  reading: string;
  isCorrect: boolean;
}
