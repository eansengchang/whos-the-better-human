import "./App.css";
import ReactionBox from "./components/ReactionBox";
import ReadyButton from "./components/ReadyButton";
import { generateRandom } from "./utils/functions";
import { useRef, useState, useEffect } from "react";
import { socket } from "./socket";

function App() {
  const [playerLeaderboard, setScores] = useState({
    1: [],
    2: [],
  });
  const [roundRunning, setRoundRunning] = useState(false);
  const [timer1Running, setTimer1Running] = useState(false);

  const [timerTwoStartStamp, setTimerTwoStartStamp] = useState();
  const [timerTwoAFKTimeout, setTimerTwoAFKTimeout] = useState();

  function readyHandler() {
    socket.emit("player-ready");
  }

  function clickHandler() {
    console.log("Player Clicked!");
    if (roundRunning) {
      setRoundRunning(false);
      clearTimeout(timerTwoAFKTimeout);

      let reactionTime = Date.now() - timerTwoStartStamp;

      console.log(`Player Clicked at ${reactionTime}ms`);
      socket.emit("player-score", reactionTime);
      return;
    } else {
      if (timer1Running) {
        // If clicked before timer 1 finished
        setTimer1Running(false);
        clearTimeout(timerTwoAFKTimeout);

        console.log("Player Clicked before Timer 1 Finished!");
        socket.emit("player-score", 1000);
      }
    }
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

  // Timer 1
  function onRoundStart() {
    setRoundRunning(false);
    console.log("Timer Triggered");
    setTimer1Running(true);

    // Random time between 2-4 secs
    let timerOneLength = generateRandom(2000) + 2000;
    console.log(`random time generated: ${timerOneLength}`);

    let timeoutId = setTimeout(() => {
      console.log("Timer 1 Finished: Turning Screen Red!");

      setRoundRunning(true);
      setTimer1Running(false);

      timer2();
    }, timerOneLength);
  }

  //Timer 2
  function timer2() {
    console.log("Timer 2 Triggered");
    setTimerTwoStartStamp(Date.now());

    let timeoutId = setTimeout(() => {
      if (!roundRunning) {
        console.log(`Player Clicked at 1000 ms`);
        socket.emit("player-score", 1000);

        console.log("Timer 2 Finished: Turning Screen Normal!");

        setRoundRunning(false);
      }
    }, 1000);

    setTimerTwoAFKTimeout(timeoutId);
  }

  return (
    <div className="App">
      <div className="hero-title">
        <h1>WHOSTHEBETTERHUMAN</h1>
      </div>
      <div className="timer-containers">
        {/* <h2>{reactionTimer}</h2>
        <h2>{measureTimer}</h2> */}
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
