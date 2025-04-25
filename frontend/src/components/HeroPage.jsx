import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroPage.css";
import logoImage from "../assets/wtbh-logo.png";

const HeroPage = () => {
  const navigate = useNavigate();
  const handleCreateRoom = () => {
    console.log("Create Room button clicked");
    // Navigate to the game page
    navigate("/game");
  };

  const handleJoinRoom = () => {
    console.log("Join Room button clicked");
  };

  return (
    <div className="heroPage">
      <img src={logoImage} alt="Logo" className="logo"></img>
      <h1 className="heroTitle">WHOSTHEBETTERHUMAN?</h1>
      <div className="heroButtons">
        <button className="heroButton" onClick={handleCreateRoom}>
          Create Room
        </button>
        <input
          type="text"
          placeholder="Enter Room Code"
          className="roomInputField"
        />
        <button className={"heroButton"} onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default HeroPage;
