const io = require("socket.io")({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let playersReady = 0;
let currentRound = 0;
let numPlayers = 0;
let playerNumberFromId = {};

let gameState = {
  players: {
    1: {
      score: [],
      isReady: false,
    },
    2: {
      score: [],
      isReady: false,
    },
  },
};

const NUMBEROFROUNDS = 5;

io.on("connect", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  numPlayers += 1;
  playerNumberFromId[socket.id] = numPlayers;

  socket.on("player-ready", () => {
    console.log(`Player ${playerNumberFromId[socket.id]} ready!`);

    //ignore players that are already ready
    let player = gameState.players[playerNumberFromId[socket.id]];

    if (player.isReady) return;

    player.isReady = true;
    playersReady += 1;

    // all players are ready so start the game
    if (playersReady === 2) {
      currentRound += 1;
      playersReady = 0;

      if (currentRound > NUMBEROFROUNDS) {
        console.log("Game Ended!");
        io.emit("game-end", gameState);
      } else {
        console.log("Moving on to next round!");

        io.emit("next-round");
      }

      //reset players ready
      Object.keys(gameState.players).forEach((key) => {
        gameState.players[key].isReady = false;
      });
    }
  });

  socket.on("player-score", (score) => {
    console.log(
      `Received Player ${playerNumberFromId[socket.id]} Score: ${score}!`
    );
    const playerNumber = playerNumberFromId[socket.id];
    gameState.players[playerNumber].score.push(score);
    io.emit("scoreboard", gameState);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    delete playerNumberFromId[socket.id];
    numPlayers -= 1;
  });
});

io.listen(process.env.PORT || 4000);
console.log(`LISTENING ON: ${process.env.PORT || 4000}`);
