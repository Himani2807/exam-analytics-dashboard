import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });

    // Example of emitting real-time data
    setInterval(() => {
        const data = { timestamp: new Date(), value: Math.random() }; // Replace with actual data
        socket.emit("dataUpdate", data);
    }, 1000); // Emit data every second
});

export const startSocketServer = (port) => {
    httpServer.listen(port, () => {
        console.log(`Socket server is running on port ${port}`);
    });
};