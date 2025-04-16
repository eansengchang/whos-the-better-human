import React from "react";
import "./ReadyButton.css";

function ReadyButton({ readyHandler }) {
  return (
    <div className="readybutton-container">
      <button className="ready-button" onClick={readyHandler}>
        Ready
      </button>
    </div>
  );
}

export default ReadyButton;
