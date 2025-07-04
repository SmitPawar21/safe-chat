import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    },
});

const userSocketMap = {}; // {userId: socketId

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    console.log(userId);
    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // it is used to send events to all the connected clients
    
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId]; // disconnect hua = offline gaya toh update karo map ko
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // wapas bata do sab ko
    });
})

export {app, io, server};