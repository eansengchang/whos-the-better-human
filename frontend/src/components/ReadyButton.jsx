import React from "react";
import "./ReadyButton.css";

function ReadyButton({ startHandler }) {
  return (
    <div className="readybutton-container">
      <button className="ready-button" onClick={startHandler}>
        Ready
      </button>
    </div>
  );
}

export default ReadyButton;
