import { useCallback, useState } from "react";

const STORAGE_KEY = "jp-sentence-builder-furigana";

export function useFurigana() {
  const [showFurigana, setShowFurigana] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== "false";
    } catch {
      return true;
    }
  });

  const toggleFurigana = useCallback(() => {
    setShowFurigana((value) => {
      const next = !value;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { showFurigana, toggleFurigana };
}
