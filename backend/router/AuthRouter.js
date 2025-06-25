import express from "express";
import { checkAuth, loginUser, logoutUser, registerUser } from "../controller/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/auth/check", verifyToken, checkAuth);

router.get("/logout", logoutUser);

export default router;