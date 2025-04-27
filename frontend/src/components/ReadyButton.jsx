import React from "react";
import "./ReadyButton.css";

function ReadyButton({ readyHandler, clickedReady }) {
  return (
    <div className="readybutton-container">
      <button className="ready-button" onClick={readyHandler}>
        {clickedReady ? "You have readied up!" : "Ready"} 
      </button>
    </div>
  );
}

export default ReadyButton;
