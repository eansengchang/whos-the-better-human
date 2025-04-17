import "./App.css";
import ReactionBox from "./components/ReactionBox";
import ReadyButton from "./components/ReadyButton";
import { generateRandom } from "./utils/functions";
import { useRef, useState, useEffect } from "react";
import { socket } from "./socket";

function App() {
  const [reactionTimer, setTimer] = useState();
  const [socketReady, setReady] = useState(false);
  const [isZero, setZero] = useState(false);
  function readyHandler() {
    socket.emit("player-ready");
    console.log("Test");
  }

  const intervalRef = useRef(null);

  useEffect(() => {
    socket.connect();
    console.log(socket);

    function onRoundStart() {
      setReady(true);
    }
    socket.on("round-start", onRoundStart);

    return () => {
      socket.off("round-start", onRoundStart);
    };
  }, []);

  useEffect(() => {
    console.log("Timer Triggered");

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setTimer(generateRandom());

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalRef.current);
          setZero(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      console.log("Cleaning Up");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setZero(false);
    };
  }, [socketReady]);

  return (
    <div className="App">
      <div className="hero-title">
        <h1>WHOSTHEBETTERHUMAN</h1>
      </div>
      <h2>{reactionTimer}</h2>
      <ReactionBox />
      <ReadyButton readyHandler={readyHandler} />
    </div>
  );
}
export default App;
