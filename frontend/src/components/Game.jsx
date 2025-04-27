import "../App.css";
import ReactionBox from "./ReactionBox";
import ReadyButton from "./ReadyButton";
import { generateRandom } from "../utils/functions";
import GameOver from "./GameOver";
import { useState, useEffect } from "react";
import { socket } from "../socket";

function Game({ gameObj, playerNumber }) {
  const [winner, setWinner] = useState("Player 1");
  const [gameFinished, setGameFinished] = useState(false);
  const [roundRunning, setRoundRunning] = useState(false);
  const [timer1Running, setTimer1Running] = useState(false);
  const [timer1AFKTimeout, setTimer1AFKTimeout] = useState();

  const [timerTwoStartStamp, setTimerTwoStartStamp] = useState();
  const [timerTwoAFKTimeout, setTimerTwoAFKTimeout] = useState();

  const [clickedReady, setClickedReady] = useState(false);

  const gameState = gameObj.state;

  function readyHandler() {
    if (clickedReady) return;
    if (timer1Running || roundRunning) {
      console.log("Player clicked ready during a round!");
      return;
    }
    socket.emit("player-ready");
    setClickedReady(true);
  }

  function clickHandler() {
    console.log("Player Clicked!");
    if (roundRunning) {
      setRoundRunning(false);
      clearTimeout(timerTwoAFKTimeout);

      let reactionTime = Date.now() - timerTwoStartStamp;

      console.log(`Player Clicked at ${reactionTime}ms`);
      socket.emit("player-score", reactionTime);
      setClickedReady(false);
      return;
    } else {
      if (timer1Running) {
        // If clicked before timer 1 finished
        setTimer1Running(false);
        clearTimeout(timer1AFKTimeout);
        setRoundRunning(false);

        console.log("Player Clicked before Timer 1 Finished!");
        socket.emit("player-score", 1000);
        setClickedReady(false);
      }
    }
  }

  // Listener UseEffect
  useEffect(() => {
    socket.on("next-round", onRoundStart);
    // socket.on("game-end", onGameEnd);
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
    setTimer1AFKTimeout(timeoutId);
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
        setClickedReady(false);
      }
    }, 1000);

    setTimerTwoAFKTimeout(timeoutId);
  }

  // Game End TODO
  // function onGameEnd() {
  //   setGameFinished(true);
  //   let player1Average = () => {
  //     let player1Sum = 0;
  //     playerLeaderboard[1].forEach((score) => {
  //       player1Sum += score;
  //     });
  //     return Math.round(player1Sum / 5);
  //   };
  //   let player2Average = () => {
  //     let player1Sum = 0;
  //     playerLeaderboard[2].forEach((score) => {
  //       player1Sum += score;
  //     });
  //     return Math.round(player1Sum / 5);
  //   };

  //   console.log(player1Average() + " vs " + player2Average());
  //   if (player2Average() < player1Average()) {
  //     setWinner("Player 2");
  //     return;
  //   }
  // }

  return (
    <div className="Game">
      {gameFinished ? <GameOver winner={winner} /> : null}
      <div className="nav-container">
        {/* <h2>You are player {playerNumber}</h2> */}
        <h2 className="nav-item">Room Name: {gameObj.roomName}</h2>
        <h1>WHOSTHEBETTERHUMAN</h1>
        <h2 className="nav-item">
          Ready: {gameState.playersReady == null ? 0 : gameState.playersReady}/2
        </h2>
      </div>
      <div className="round-container">
        <h2>You are player {playerNumber} </h2>
        <h2 className="round-item">Round {gameState.currentRound}/5</h2>
      </div>
      <ReactionBox
        clickHandler={clickHandler}
        roundRunning={roundRunning}
        timer1Running={timer1Running}
      />
      <ReadyButton readyHandler={readyHandler} clickedReady={clickedReady} />
      {
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Player 1</th>
                <th>Player 2</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: gameState.currentRound }).map((_, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{gameObj.players[1].score[i]}</td>
                  <td>{gameObj.players[2].score[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}
export default Game;
