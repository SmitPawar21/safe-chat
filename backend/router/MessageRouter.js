import express from "express";
import { getAllMessages, getMessageForOne, sendMessage } from "../controller/MessageController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/all-messages", verifyToken, getAllMessages);
router.get("/:id", verifyToken, getMessageForOne);

router.post("/send/:id", verifyToken, sendMessage);

export default router;