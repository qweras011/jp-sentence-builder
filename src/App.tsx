import { useState } from "react";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";
import { VocabPage } from "./pages/VocabPage";

type View = "home" | "sentence" | "vocab";

function App() {
  const [view, setView] = useState<View>("home");

  if (view === "home") {
    return (
      <HomePage
        onStartSentence={() => setView("sentence")}
        onStartVocab={() => setView("vocab")}
      />
    );
  }

  if (view === "vocab") {
    return <VocabPage onHome={() => setView("home")} />;
  }

  return <GamePage onHome={() => setView("home")} />;
}

export default App;
