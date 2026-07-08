import { useState } from "react";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";

type View = "home" | "game";

function App() {
  const [view, setView] = useState<View>("home");

  if (view === "home") {
    return <HomePage onStart={() => setView("game")} />;
  }

  return <GamePage onHome={() => setView("home")} />;
}

export default App;
