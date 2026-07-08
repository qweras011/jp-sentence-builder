import type { VocabChoice, VocabItem } from "../types/vocab";
import { shuffle } from "./shuffle";

const LABELS = ["A", "B", "C"] as const;

export function buildVocabChoices(item: VocabItem, pool: VocabItem[]): VocabChoice[] {
  const distractors = shuffle(
    pool.filter((candidate) => candidate.id !== item.id && candidate.korean !== item.korean),
  ).slice(0, 2);

  while (distractors.length < 2) {
    distractors.push({ id: -1, word: "", reading: "", korean: "—" });
  }

  const choices = shuffle([
    { korean: item.korean, isCorrect: true },
    { korean: distractors[0].korean, isCorrect: false },
    { korean: distractors[1].korean, isCorrect: false },
  ]);

  return choices.map((choice, index) => ({
    label: LABELS[index],
    korean: choice.korean,
    isCorrect: choice.isCorrect,
  }));
}
