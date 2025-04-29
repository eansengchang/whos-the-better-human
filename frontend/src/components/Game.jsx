import "../App.css";
import ReactionBox from "./ReactionBox";
import ReadyButton from "./ReadyButton";
import { generateRandom } from "../utils/functions";
import GameOver from "./GameOver";
import { useState, useEffect } from "react";
import { socket } from "../socket";

function Game({ gameObj, playerNumber, handleMainMenu }) {
  const [winner, setWinner] = useState("");
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
    socket.on("game-end", (gameEndData) => {
      console.log("Game Ended: ", gameEndData);
      onGameEnd(gameEndData.game);
    });
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

  function onGameEnd(finalGameObj) {
    setGameFinished(true);
    function getPlayerAverage(playerNumber) {
      let total = 0;
      let playerScores = finalGameObj.players[playerNumber].score;
      for (let i = 0; i < playerScores.length; i++) {
        total += playerScores[i];
      }
      console.log(`Player ${playerNumber} Total: ${total}`);
      return total / finalGameObj.state.currentRound;
    }

    let player1Average = getPlayerAverage(1);
    let player2Average = getPlayerAverage(2);
    console.log(`Player 1 Average: ${player1Average}`);
    console.log(`Player 2 Average: ${player2Average}`);
    if (player1Average < player2Average) {
      setWinner("Player 1");
    } else if (player1Average > player2Average) {
      setWinner("Player 2");
    } else {
      setWinner("Draw");
    }
  }

  return (
    <div className="Game">
      {gameFinished ? (
        <GameOver winner={winner} handleMainMenu={handleMainMenu} />
      ) : null}
      <div className="nav-container">
        {/* <h2>You are player {playerNumber}</h2> */}
        <h2 className="nav-item">Room Name: {gameObj.roomName}</h2>
        <h1>WHOSTHEBETTERHUMAN</h1>
        <h2 className="nav-item">
          Ready: {gameState.playersReady == null ? 0 : gameState.playersReady}/2
        </h2>
      </div>
      <div className="game-container">
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
      </div>
      <div className="side-interface-container">
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
        <div className="chat-container">
          <div className="chat-box">
            <p>Player 1 Joined.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Game;
