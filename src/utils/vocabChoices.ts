import type { VocabChoice, VocabDirection, VocabItem } from "../types/vocab";
import { shuffle } from "./shuffle";

const LABELS = ["A", "B", "C"] as const;

function toChoice(item: VocabItem, isCorrect: boolean, index: number): VocabChoice {
  return {
    label: LABELS[index],
    korean: item.korean,
    word: item.word,
    reading: item.reading,
    isCorrect,
  };
}

export function buildVocabChoices(
  item: VocabItem,
  pool: VocabItem[],
  direction: VocabDirection,
): VocabChoice[] {
  if (direction === "reverse") {
    return buildReverseVocabChoices(item, pool);
  }

  const distractors = shuffle(
    pool.filter((candidate) => candidate.id !== item.id && candidate.korean !== item.korean),
  ).slice(0, 2);

  while (distractors.length < 2) {
    distractors.push({ id: -1, word: "—", reading: "", korean: "—", level: "n4" });
  }

  const options = shuffle([
    { item, isCorrect: true },
    { item: distractors[0], isCorrect: false },
    { item: distractors[1], isCorrect: false },
  ]);

  return options.map((option, index) => toChoice(option.item, option.isCorrect, index));
}

function buildReverseVocabChoices(item: VocabItem, pool: VocabItem[]): VocabChoice[] {
  const distractors = shuffle(
    pool.filter((candidate) => candidate.id !== item.id && candidate.word !== item.word),
  ).slice(0, 2);

  while (distractors.length < 2) {
    distractors.push({ id: -1, word: "—", reading: "", korean: "—", level: "n4" });
  }

  const options = shuffle([
    { item, isCorrect: true },
    { item: distractors[0], isCorrect: false },
    { item: distractors[1], isCorrect: false },
  ]);

  return options.map((option, index) => toChoice(option.item, option.isCorrect, index));
}
