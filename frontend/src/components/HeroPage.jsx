import React from "react";
import "./HeroPage.css";
import logoImage from "../assets/wtbh-logo.png";
import { socket } from "../socket"; // Import the socket instance

const HeroPage = ({errorMessage}) => {

  const [roomCode, setRoomCode] = React.useState("");

  const handleCreateRoom = () => {
    console.log("Create Room button clicked");
    socket.emit("create-room"); // Calls State-update
  }

  const handleJoinRoom = () => {
    console.log("Join Room button clicked");
    socket.emit("join-room", roomCode); // Calls State-update
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
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button className={"heroButton"} onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>
      <div className="errorMessage">
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default HeroPage;
