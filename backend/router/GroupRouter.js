import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getGroupMessages } from "../controller/MessageController.js";
import { addMembersToGroup, createNewGroup, groupsForOneUser, leaveGroup, removeMembersFromGroup } from "../controller/GroupController.js";

const router = express.Router();

router.get("/groups-for-user", verifyToken, groupsForOneUser);

router.get("/:groupId", verifyToken, getGroupMessages);

router.post("/create", verifyToken, createNewGroup);

router.put("/add-members", verifyToken, addMembersToGroup);

router.put("/remove-member", verifyToken, removeMembersFromGroup);

router.get("/leave-group/:groupId", verifyToken, leaveGroup);


export default router;