import type { SentenceItem } from "../types/sentence";
import { isTrackablePiece } from "./selectDaily";

export type PieceMatchState = "correct" | "incorrect";

export interface PieceMatch {
  piece: string;
  state: PieceMatchState;
}

export function getOrderedAnswerPieces(sentence: SentenceItem): string[] {
  return sentence.shuffled.filter(isTrackablePiece);
}

export function compareSentencePieces(
  selected: string[],
  sentence: SentenceItem,
): PieceMatch[] {
  const correct = getOrderedAnswerPieces(sentence);

  return selected.map((piece, index) => ({
    piece,
    state: piece === correct[index] ? "correct" : "incorrect",
  }));
}
