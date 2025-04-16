const io = require("socket.io")({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connect", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on("player-ready", () => {
    console.log(`Socket ready: ${socket.id}`);
  });
});

io.listen(process.env.PORT || 4000);
console.log(`LISTENING ON: ${process.env.PORT || 4000}`);
