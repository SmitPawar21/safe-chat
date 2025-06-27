import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

import UserRouter from "./router/UserRouter.js";
import AuthRouter from "./router/AuthRouter.js";
import MessageRouter from "./router/MessageRouter.js";

import {app, server} from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const _dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Database Connected"));

app.use("/", AuthRouter);
app.use("/", UserRouter);
app.use("/message", MessageRouter);

app.get("/", (req, res) => {
    console.log("/");
    res.status(201).json({"message": "hello"});
})

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
})