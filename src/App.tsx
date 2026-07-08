import { useDarkMode } from "./hooks/useDarkMode";
import { useState } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";
import { VocabPage } from "./pages/VocabPage";

type View = "home" | "sentence" | "vocab";

function App() {
  const { dark, toggle } = useDarkMode();
  const [view, setView] = useState<View>("home");

  return (
    <>
      <ThemeToggle dark={dark} onToggle={toggle} className="fixed top-3 right-3 z-50" />

      {view === "home" && (
        <HomePage
          onStartSentence={() => setView("sentence")}
          onStartVocab={() => setView("vocab")}
        />
      )}

      {view === "vocab" && <VocabPage onHome={() => setView("home")} />}

      {view === "sentence" && <GamePage onHome={() => setView("home")} />}
    </>
  );
}

export default App;
