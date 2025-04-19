import "./App.css";
import ReactionBox from "./components/ReactionBox";
import ReadyButton from "./components/ReadyButton";
import { generateRandom } from "./utils/functions";
import { useRef, useState, useEffect } from "react";
import { socket } from "./socket";

function App() {
  const [reactionTimer, setTimer] = useState(); // Timer 1
  const [measureTimer, setMeasureTimer] = useState(); // Timer 2

  const [playerLeaderboard, setScores] = useState({
    1: [],
    2: [],
  });
  const [roundRunning, setRoundRunning] = useState(false);
  const [timer1Running, setTimer1Running] = useState(false);

  function readyHandler() {
    socket.emit("player-ready");
  }

  function clickHandler() {
    console.log("Player Clicked!");
    if (roundRunning) {
      clearInterval(interval2Ref.current);
      setMeasureTimer();

      setRoundRunning(false);
      console.log(`Player Clicked at ${measureTimer}ms`);
      socket.emit("player-score", measureTimer);
      return;
    } else {
      if (timer1Running) {
        // If clicked before timer 1 finished
        clearInterval(intervalRef.current);
        setTimer1Running(false);
        setTimer();
        console.log("Player Clicked before Timer 1 Finished!");
        socket.emit("player-score", 1000);
      }
    }
  }

  // Timer 1
  const intervalRef = useRef(null);

  function onRoundStart() {
    setRoundRunning(false);
    console.log("Timer Triggered");
    setTimer1Running(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    function onTimer1Finish() {
      console.log("Timer 1 Finished: Turning Screen Red!");

      setRoundRunning(true);
      setTimer1Running(false);

      timer2();
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
  }
  // Listener UseEffect
  useEffect(() => {
    function onLeaderboardReceive(gameState) {
      let scores = {
        1: gameState.players[1].score,
        2: gameState.players[2].score,
      };
      setScores(scores);
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

      setRoundRunning(false);
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
  }

  return (
    <div className="App">
      <div className="hero-title">
        <h1>WHOSTHEBETTERHUMAN</h1>
      </div>
      <div className="timer-containers">
        <h2>{reactionTimer}</h2>
        <h2>{measureTimer}</h2>
      </div>
      <ReactionBox
        clickHandler={clickHandler}
        roundRunning={roundRunning}
        timer1Running={timer1Running}
      />
      <h3>Player 1: {playerLeaderboard[1].join()}</h3>
      <h3>Player 2: {playerLeaderboard[2].join()}</h3>
      <ReadyButton readyHandler={readyHandler} />
    </div>
  );
}
export default App;
