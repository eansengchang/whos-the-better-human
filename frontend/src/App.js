import "./App.css";
import Game from "./components/Game"; // Import the new Game component
import { Routes, Route, Link } from "react-router-dom";
import HeroPage from "./components/HeroPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
