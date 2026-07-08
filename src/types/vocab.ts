export type VocabDirection = "forward" | "reverse";

export interface VocabItem {
  id: number;
  word: string;
  reading: string;
  korean: string;
}

export type VocabFeedback = "idle" | "correct" | "incorrect";

export interface VocabChoice {
  label: string;
  korean: string;
  word: string;
  reading: string;
  isCorrect: boolean;
}
