import React from "react";
import "./ReactionBox.css";

function ReactionBox({ isTimerFinished, clickHandler }) {
  console.log(isTimerFinished);
  return (
    <div className="reaction-box">
      <button
        className={`click-button ${isTimerFinished || ""}`}
        onClick={clickHandler}>
        CLICK!
      </button>
    </div>
  );
}

export default ReactionBox;
