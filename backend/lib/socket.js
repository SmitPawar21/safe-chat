import { Server } from "socket.io";
import http from "http";
import express from "express";
import { publishMessage } from "./kafkaProducer.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (userId) => {
  console.log("getReceiverSocketId userId: ", userId);
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("on connection userId: ", userId);
  if (userId) userSocketMap[userId] = socket.id;

  // Notify local clients about current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Publish presence to Kafka (so all servers know)
  (async () => {
    try {
      if (userId) {
        await publishMessage("user-status-updates", userId, {
          userId,
          status: "online",
          originServerId: process.env.SERVER_ID || "1",
        });
        console.log(userId, " is online right now");
      }
    } catch (err) {
      console.warn("Failed to publish user-online to Kafka:", err);
    }
  })();

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    (async () => {
      try {
        if (userId) {
          await publishMessage("user-status-updates", userId, {
            userId,
            status: "offline",
            originServerId: process.env.SERVER_ID || "1",
          });
        }
      } catch (err) {
        console.warn("Failed to publish user-offline to Kafka:", err);
      }
    })();
  });
});

export { app, io, server };
