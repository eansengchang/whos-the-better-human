import "./App.css";
import ReactionBox from "./components/ReactionBox";
import StartButton from "./components/StartButton";
import { generateRandom } from "./utils/functions";
import { useRef, useState, useEffect } from "react";

function App() {
  const [reactionTimer, setTimer] = useState();
  const [timerTrigger, setTimerTrigger] = useState(0);
  const [isZero, setZero] = useState(false);
  function startHandler() {
    setTimerTrigger((prevTrigger) => prevTrigger + 1);
  }

  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerTrigger <= 0) {
      return;
    }

    console.log("Timer Triggered");

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setTimer(generateRandom());

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalRef.current);
          setZero(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      console.log("Cleaning Up");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerTrigger]);

  return (
    <div className="App">
      <div className="hero-title">
        <h1>WHOSTHEBETTERHUMAN</h1>
      </div>
      <h2>{reactionTimer}</h2>
      <ReactionBox />
      <StartButton startHandler={startHandler} />
    </div>
  );
}
export default App;
