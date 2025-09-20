import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

import UserRouter from "./router/UserRouter.js";
import AuthRouter from "./router/AuthRouter.js";
import MessageRouter from "./router/MessageRouter.js";

import { app, server } from "./lib/socket.js";
import { producer } from "./lib/kafka.js";
import { startKafkaConsumer } from "./lib/kafkaConsumer.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  mongoose.connect(process.env.MONGODB_URI_2).then(() => console.log("Database Connected 2"));
} else {
  mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Database Connected"));
}

app.use("/", AuthRouter);
app.use("/", UserRouter);
app.use("/message", MessageRouter);

app.get("/", (req, res) => {
  console.log("/");
  res.status(201).json({ message: "hello" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

async function start() {
  try {
    // Connect Kafka producer
    await producer.connect();
    console.log("✅ Kafka producer connected");

    // Start consumer (starts in background)
    await startKafkaConsumer(/* pass io from socket.js */ (await import("./lib/socket.js")).io);

    server.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start services:", err);
    process.exit(1);
  }
}

start();
