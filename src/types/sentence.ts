export interface RubySegment {
  text: string;
  reading: string;
}

export interface SentenceItem {
  id: number;
  korean: string;
  japanese: string;
  ruby: RubySegment[];
  shuffled: string[];
}

export type FeedbackState = "idle" | "correct" | "incorrect";
