import type { SentenceItem } from "../types/sentence";
import type { VocabItem } from "../types/vocab";
import type { JlptLevel } from "../types/level";

import n5Sentences from "./levels/n5/sentences.json";
import n4Sentences from "./levels/n4/sentences.json";
import n3Sentences from "./levels/n3/sentences.json";
import n2Sentences from "./levels/n2/sentences.json";
import n1Sentences from "./levels/n1/sentences.json";

import n5Vocab from "./levels/n5/vocab.json";
import n4Vocab from "./levels/n4/vocab.json";
import n3Vocab from "./levels/n3/vocab.json";
import n2Vocab from "./levels/n2/vocab.json";
import n1Vocab from "./levels/n1/vocab.json";

const sentencesByLevel: Record<JlptLevel, SentenceItem[]> = {
  n5: n5Sentences as SentenceItem[],
  n4: n4Sentences as SentenceItem[],
  n3: n3Sentences as SentenceItem[],
  n2: n2Sentences as SentenceItem[],
  n1: n1Sentences as SentenceItem[],
};

const vocabByLevel: Record<JlptLevel, VocabItem[]> = {
  n5: n5Vocab as VocabItem[],
  n4: n4Vocab as VocabItem[],
  n3: n3Vocab as VocabItem[],
  n2: n2Vocab as VocabItem[],
  n1: n1Vocab as VocabItem[],
};

export function getSentencesForLevel(level: JlptLevel): SentenceItem[] {
  return sentencesByLevel[level];
}

export function getVocabForLevel(level: JlptLevel): VocabItem[] {
  return vocabByLevel[level];
}

export function getLevelContentCounts(level: JlptLevel): {
  sentences: number;
  vocab: number;
} {
  return {
    sentences: sentencesByLevel[level].length,
    vocab: vocabByLevel[level].length,
  };
}

export function hasLevelContent(level: JlptLevel): boolean {
  const { sentences, vocab } = getLevelContentCounts(level);
  return sentences > 0 || vocab > 0;
}
