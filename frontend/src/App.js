import "./App.css";
import ReactionBox from "./components/ReactionBox";
import StartButton from "./components/StartButton";
function App() {
  return (
    <div className="App">
      <div className="hero-title">
        <h1>WHOSTHEBETTERHUMAN</h1>
      </div>
      <ReactionBox />
      <StartButton />
    </div>
  );
}
export default App;
