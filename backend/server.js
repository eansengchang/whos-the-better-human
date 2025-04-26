const io = require("socket.io")({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { makeid } = require("./utils");

// SERVER WIDE SETTINGS
const NUMBEROFROUNDS = 5;

/*
game is a dictionary with the keys as the roomNumbers
    state: state of the game
    players: the dictionary of players mapped by their player numbers
    playerNumberFromId: gets player number from socket id
*/
let newGameObj = (roomName) => {
  return {
    state: {
      playersReady: 0,
      currentRound: 0,
      numPlayers: 0,
    },
    players: {},
    playerNumberFromId: {},
    roomName: roomName,
  };
};

let newPlayerObj = () => {
  return {
    score: [],
    isReady: false,
  };
};

const socketRooms = {};
let getGameObjFromRoom = {};

io.on("connect", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join-room", handleJoinRoom);
  socket.on("create-room", handleNewRoom);

  socket.on("player-ready", handlePlayerReady);
  socket.on("player-score", handlePlayerScore);
  // socket.on("disconnect", handleDisconnect);

  function handleJoinRoom(roomName) {
    if (!roomName) {
      socket.emit("unknownCode");
      return;
    }
    //room is a set
    const room = io.sockets.adapter.rooms.get(roomName);

    //get the size of the room if its a thing
    let numsockets;
    if (room) {
      numsockets = room.size;
    }

    if (!room || numsockets === 0) {
      socket.emit("unknownCode");
      return;
    } else if (numsockets >= 2) {
      socket.emit("tooManyPlayers");
      return;
    }

    console.log(`Socket joining room: ${roomName}`)

    socketRooms[socket.id] = roomName;
    socket.join(roomName);

    //find the lowest free player id
    let thisPlayerId = 1;
    while (getGameObjFromRoom[roomName].players[thisPlayerId] != null) {
      thisPlayerId += 1;
    }

    const currentGame = getGameObjFromRoom[socketRooms[socket.id]];

    currentGame.playerNumberFromId[socket.id] = thisPlayerId
    currentGame.players[thisPlayerId] = newPlayerObj()

    socket.emit("state-update", {
      playerNumber: thisPlayerId,
      state: currentGame,
    });
  }

  function handleNewRoom() {
    console.log("Handling new room")
    const roomName = makeid(5);
    socketRooms[socket.id] = roomName;
    socket.join(roomName);

    console.log(`Creating new room: ${roomName}`)

    getGameObjFromRoom[roomName] = newGameObj(roomName);
    thisGameObj = getGameObjFromRoom[roomName];

    thisGameObj.players[1] = newPlayerObj();
    thisGameObj.playerNumberFromId[socket.id] = 1;
    thisGameObj.roomName = roomName

    socket.emit("state-update", {
      playerNumber: 1,
      state: thisGameObj,
    });
  }

  function handlePlayerReady() {
    const currentGame = getGameObjFromRoom[socketRooms[socket.id]];
    const thisPlayerId = currentGame.playerNumberFromId[socket.id];
    const thisState = currentGame.state;

    console.log(`Room ${socketRooms[socket.id]} Player ${thisPlayerId} ready!`);

    //ignore players that are already ready
    let player = currentGame.players[thisPlayerId];

    if (player.isReady) return;

    player.isReady = true;
    thisState.playersReady += 1;

    // all players are ready so start the game
    if (thisState.playersReady === 2) {
      thisState.currentRound += 1;
      thisState.playersReady = 0;
      
      if (currentGame.state.currentRound > NUMBEROFROUNDS) {
        console.log("Game Ended!");
        io.in(socketRooms[socket.id]).emit("game-end", currentGame);
      } else {
        console.log("Moving on to next round!");

        io.in(socketRooms[socket.id]).emit("next-round");
      }

      //reset players ready
      Object.keys(currentGame.players).forEach((key) => {
        currentGame.players[key].isReady = false;
      });
    } 
    else {
      io.in(socketRooms[socket.id]).emit("state-update", {
        playerNumber: thisPlayerId,
        state: currentGame,
      });
    }
  }

  function handlePlayerScore(score) {
    const currentGame = getGameObjFromRoom[socketRooms[socket.id]];

    console.log(
      `Room ${socketRooms[socket.id]} Received Player ${
        currentGame.playerNumberFromId[socket.id]
      } Score: ${score}!`
    );
    const playerNumber = currentGame.playerNumberFromId[socket.id];
    currentGame.players[playerNumber].score.push(score);
    io.emit("scoreboard", currentGame.state);
  }

  // function handleDisconnect() {
  //   console.log(`Socket disconnected: ${socket.id}`);
  //   if (!socketRooms[socket.id]) return;

  //   const currentGame = getGameObjFromRoom[socketRooms[socket.id]];

  //   delete currentGame.playerNumberFromId[socket.id];
  //   currentGame.state.numPlayers -= 1;
  // }
});

io.listen(process.env.PORT || 4000);
console.log(`LISTENING ON: ${process.env.PORT || 4000}`);