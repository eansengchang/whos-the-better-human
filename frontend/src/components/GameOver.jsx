import React from "react";
import "./GameOver.css";

function GameOver({ winner, handleMainMenu }) {
  const handleButtonClick = () => {
    handleMainMenu();
  };
  return (
    <div className="game-over-container">
      <h1 className="game-over-text">Game Over!</h1>
      <h2 className="game-over-winner">{winner} Wins!</h2>
      <button onClick={handleButtonClick}>Main Menu</button>
    </div>
  );
}

export default GameOver;
