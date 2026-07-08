import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "jp-sentence-builder-dark-mode";

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, String(dark));
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((value) => !value);
  }, []);

  return { dark, toggle };
}
