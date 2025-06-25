import express from "express";
import { getAllUsers, getOneUser, getUsersForSidebar } from "../controller/UserController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/all-users", verifyToken, getAllUsers);
router.get("/user/:id", verifyToken, getOneUser);
router.get("/users", verifyToken, getUsersForSidebar);

export default router;