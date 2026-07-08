import { useDarkMode } from "./hooks/useDarkMode";
import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";
import { VocabPage } from "./pages/VocabPage";

type View = "home" | "sentence" | "vocab";

function App() {
  const { dark, toggle } = useDarkMode();
  const [view, setView] = useState<View>("home");

  return (
    <>
      <TopBar
        dark={dark}
        onToggleTheme={toggle}
        showHome={view !== "home"}
        onHome={() => setView("home")}
      />

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
