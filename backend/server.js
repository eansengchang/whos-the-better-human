const io = require("socket.io")({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let playersReady = 0;
let currentRound = 0;
let playerScores = { 0: [], 1: [] };
let numPlayers = 0;
let playerNumberFromId = {};

io.on("connect", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  playerNumberFromId[socket.id] = numPlayers;
  numPlayers += 1;

  socket.on("player-ready", () => {
    console.log(`Player ${playerNumberFromId[socket.id]} ready!`);
    playersReady += 1;

    if (playersReady === 2) {
      currentRound += 1;
      playersReady = 0;

      if (currentRound > 5) {
        console.log("Game Ended!");
        io.emit("game-end", playerScores);
      } else {
        console.log("Moving on to next round!");
        io.emit("next-round");
      }
    }
  });

  socket.on("player-score", (score) => {
    console.log(
      `Received Player ${playerNumberFromId[socket.id]} Score: ${score}!`
    );
    const playerNumber = playerNumberFromId[socket.id];
    playerScores[playerNumber].push(score);
    io.emit("scoreboard", playerScores);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    delete playerNumberFromId[socket.id];
    numPlayers -= 1;
  });
});

io.listen(process.env.PORT || 4000);
console.log(`LISTENING ON: ${process.env.PORT || 4000}`);
