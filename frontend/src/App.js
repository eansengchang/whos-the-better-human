import "./App.css";
import Game from "./components/Game"; // Import the new Game component
import HeroPage from "./components/HeroPage";
import { useEffect, useState } from "react";
import { socket } from "./socket"; // Import the socket instance

function App() {

    const [gameState, setGameState] = useState({
      state: {
        playersReady: 0,
        currentRound: 0,
        numPlayers: 0,
      },
      players: {},
      playerNumberFromId: {},
      roomName: null,
    });

    useEffect(() => {
      socket.on("state-update", (gameState) => {
        setGameState(gameState);
        console.log("State Update Received: ", gameState);
      });
    }, []);

  return (
    <div className="App">
      {gameState.state.roomName ? 
        <Game gameState={gameState} /> // Pass the game state to the Game component
       : 
        <HeroPage />
      }
    </div>
  );
}

export default App;
