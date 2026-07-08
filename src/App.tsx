import { useDarkMode } from "./hooks/useDarkMode";
import { useFurigana } from "./hooks/useFurigana";
import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";
import { VocabPage } from "./pages/VocabPage";

type View = "home" | "sentence" | "vocab";

function App() {
  const { dark, toggle } = useDarkMode();
  const { showFurigana, toggleFurigana } = useFurigana();
  const [view, setView] = useState<View>("home");

  return (
    <>
      <TopBar
        dark={dark}
        onToggleTheme={toggle}
        showFurigana={showFurigana}
        onToggleFurigana={toggleFurigana}
        showHome={view !== "home"}
        onHome={() => setView("home")}
      />

      {view === "home" && (
        <HomePage
          onStartSentence={() => setView("sentence")}
          onStartVocab={() => setView("vocab")}
        />
      )}

      {view === "vocab" && (
        <VocabPage showFurigana={showFurigana} onHome={() => setView("home")} />
      )}

      {view === "sentence" && (
        <GamePage showFurigana={showFurigana} onHome={() => setView("home")} />
      )}
    </>
  );
}

export default App;
