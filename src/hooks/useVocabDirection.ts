import type { VocabDirection } from "../types/vocab";
import { useCallback, useState } from "react";

const STORAGE_KEY = "jp-sentence-builder-vocab-direction";

export function useVocabDirection() {
  const [direction, setDirection] = useState<VocabDirection>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "reverse" ? "reverse" : "forward";
    } catch {
      return "forward";
    }
  });

  const setVocabDirection = useCallback((next: VocabDirection) => {
    setDirection(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleDirection = useCallback(() => {
    setVocabDirection(direction === "forward" ? "reverse" : "forward");
  }, [direction, setVocabDirection]);

  return { direction, setVocabDirection, toggleDirection };
}
