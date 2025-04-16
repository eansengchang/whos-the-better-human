import React from "react";
import "./StartButton.css";

function StartButton({ startHandler }) {
  return (
    <div className="startbutton-container">
      <button className="start-button" onClick={startHandler}>
        Start
      </button>
    </div>
  );
}

export default StartButton;
