import React from "react";
import "./StartButton.css";

function StartButton() {
  return (
    <div className="startbutton-container">
      <button className="start-button" onClick={randomTime}>
        Start
      </button>
    </div>
  );
}

export default StartButton;
