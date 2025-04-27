import "./App.css";
import Game from "./components/Game"; // Import the new Game component
import HeroPage from "./components/HeroPage";
import { useEffect, useState } from "react";
import { socket } from "./socket"; // Import the socket instance

function App() {

    const [gameObj, setgameObj] = useState({
      state: {  
        playersReady: 0,
        currentRound: 0,
        numPlayers: 0,
        roundFinished: false,
      },
      players: {},
      playerNumberFromId: {},
      roomName: null,
    });

    const [playerNumber, setPlayerNumber] = useState(null)

    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
      socket.on("game-update", (gameUpdate) => {
        setgameObj(gameUpdate.game);
        setPlayerNumber(gameUpdate.playerNumber)
        console.log("Game Update Received: ", gameUpdate);
      });
      socket.on("unknownCode", () => {
        setErrorMessage("Error: Unknown Room Code!");
      });
      socket.on("tooManyPlayers", () => {
        setErrorMessage("Error: Room is full!");
      });
      socket.on("game-end", (gameEnd) => {
        setgameObj(gameEnd.game);
        console.log("Game Ended: ", gameEnd);
      });
    }, []);

    function handleMainMenu() {
      setgameObj({
        state: {  
          playersReady: 0,
          currentRound: 0,
          numPlayers: 0,
          roundFinished: false,
        },
        players: {},
        playerNumberFromId: {},
        roomName: null,
      });
      setPlayerNumber(null);
      setErrorMessage(null);
    }

  return (
    <div className="App">
      {gameObj.roomName ? 
        <Game gameObj={gameObj} playerNumber={playerNumber} handleMainMenu={handleMainMenu} /> // Pass the game state to the Game component
       : 
        <HeroPage errorMessage={errorMessage} />
      }
    </div>
  );
}

export default App;
