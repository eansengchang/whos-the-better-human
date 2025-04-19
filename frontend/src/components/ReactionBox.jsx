import React from "react";
import "./ReactionBox.css";

function ReactionBox({ roundRunning, clickHandler, timer1Running }) {
  console.log(roundRunning);

  let reactionBoxText = "Waiting for round to start...";

  if (timer1Running) reactionBoxText = "Click when the box is yellow!";
  if (roundRunning) reactionBoxText = "CLICK!";

  return (
    <div className="reaction-box">
      <button
        className={`click-button ${roundRunning ? "click" : ""}`}
        onClick={clickHandler}
      >
        {reactionBoxText}
      </button>
    </div>
  );
}

export default ReactionBox;
