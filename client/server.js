import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const PORT = 3000;

const app = next({ dev, hostname, PORT });
const handler = app.getRequestHandler();

let onlineUsers = new Map();

const addUser = (username, socketId) => {
    const userExists = onlineUsers.find(user => user.socketId === socketId);

    if (!userExists) {
        onlineUsers.push({ username, socketId });
        console.log(`${username} added!`)
    }
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    console.log("User removed")
}

const getUserDetails = (username) => {
    return onlineUsers.find((user) => user.username === username)
}

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        socket.on("newUser", (username) => {
            addUser(username, socket.id)
        });

        socket.on("disconnect", () => {
            removeUser(socket.id)
        });

        socket.on("sendMessage", (message) => {
            io.emit("newMessage", message);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(PORT, () => {
            console.log(`> Ready on http://${hostname}:${PORT}`);
        });
});