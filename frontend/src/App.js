import "./App.css";
import ReactionBox from "./components/ReactionBox";
import ReadyButton from "./components/ReadyButton";
import { generateRandom } from "./utils/functions";
import { useRef, useState, useEffect } from "react";
import { socket } from "./socket";

function App() {
  const [reactionTimer, setTimer] = useState(); // Timer 1
  const [measureTimer, setMeasureTimer] = useState("0"); // Timer 2
  const [isFinished, setFinished] = useState(""); // Timer 1 Finish
  const [playerClicked, setPlayerClicked] = useState(false); // Timer 2 Finish (case 2: Player Clicked)
  const [playerLeaderboard, setScores] = useState({
    0: [],
    1: [],
  });
  function readyHandler() {
    socket.emit("player-ready");
    console.log("Test");
  }

  function clickHandler() {
    console.log("Player Clicked!");
    if (interval2Ref.current) {
      clearInterval(interval2Ref.current);
      setFinished("");
      setPlayerClicked(true);
      console.log(`Player Clicked at ${measureTimer}ms`);
      socket.emit("player-score", measureTimer);
    }
  }

  // Timer 1
  const intervalRef = useRef(null);

  function onRoundStart() {
    setFinished("");
    console.log("Timer Triggered");

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    function onTimer1Finish() {
      console.log("Timer 1 Finished: Turning Screen Red!");
      setFinished("click");
    }

    setTimer(generateRandom());

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalRef.current);
          onTimer1Finish();
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
      setFinished("");
    };
  }
  // Listener UseEffect
  useEffect(() => {
    function onLeaderboardReceive(data) {
      setScores(data);
    }
    socket.on("scoreboard", onLeaderboardReceive);
    socket.on("next-round", onRoundStart);
  }, []);

  //Timer 2

  const interval2Ref = useRef(null);

  function timer2() {
    console.log("Timer 2 Triggered");

    if (interval2Ref.current) {
      clearInterval(interval2Ref.current);
    }

    function onTimer2Finish() {
      console.log("Timer 2 Finished: Turning Screen Normal!");
      setTimer("");
    }

    setMeasureTimer(0);

    interval2Ref.current = setInterval(() => {
      setMeasureTimer((prevMeasureTimer) => {
        if (prevMeasureTimer >= 1000) {
          clearInterval(interval2Ref.current);
          console.log(`Player Clicked at 1000 ms`);
          socket.emit("player-score", 1000);
          onTimer2Finish();
          return 0;
        }
        return prevMeasureTimer + 1;
      });
    }, 1);

    return () => {
      console.log("Cleaning Up");
      if (interval2Ref.current) {
        clearInterval(interval2Ref.current);
      }
      setFinished("");
    };
  }
  // Timer 2 UseEffect
  useEffect(() => {
    if (isFinished === "click") {
      timer2();
    }
  }, [isFinished]);

  return (
    <div className="App">
      <div className="hero-title">
        <h1>WHOSTHEBETTERHUMAN</h1>
      </div>
      <div className="timer-containers">
        <h2>{reactionTimer}</h2>
        <h2>{measureTimer}</h2>
      </div>
      <ReactionBox isTimerFinished={isFinished} clickHandler={clickHandler} />
      <h3>Player 1: {playerLeaderboard[0].join()}</h3>
      <h3>Player 2: {playerLeaderboard[1].join()}</h3>
      <ReadyButton readyHandler={readyHandler} />
    </div>
  );
}
export default App;
