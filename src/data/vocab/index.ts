import type { VocabItem, VocabLevel } from "../../types/vocab";
import n3Data from "./n3.json";
import n4Data from "./n4.json";
import { VOCAB_TARGET_N3, VOCAB_TARGET_N4, VOCAB_TARGET_TOTAL } from "./targets";

export { VOCAB_TARGET_N3, VOCAB_TARGET_N4, VOCAB_TARGET_TOTAL };

const n4Vocab = n4Data as VocabItem[];
const n3Vocab = n3Data as VocabItem[];

export function getVocabPool(): VocabItem[] {
  return [...n4Vocab, ...n3Vocab];
}

export function getVocabCounts(): Record<VocabLevel | "total", number> {
  return {
    n4: n4Vocab.length,
    n3: n3Vocab.length,
    total: n4Vocab.length + n3Vocab.length,
  };
}

export function getVocabTargets(): Record<VocabLevel | "total", number> {
  return {
    n4: VOCAB_TARGET_N4,
    n3: VOCAB_TARGET_N3,
    total: VOCAB_TARGET_TOTAL,
  };
}
