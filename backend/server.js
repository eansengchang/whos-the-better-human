const io = require("socket.io")({
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on('connect', socket => {
    console.log(`Socket connected: ${socket.id}`)
    socket.on("player-ready", (message) => {
        console.log(`Socket ready: ${socket.id}`)
    })
})

io.listen(process.env.PORT || 3000);
console.log(`LISTENING ON: ${process.env.PORT || 3000}`)