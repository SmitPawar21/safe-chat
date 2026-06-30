import express from "express";
import User from "../model/User.js";
import Message from "../model/Message.js";

export const getAllUsers = async (req, res) => {
    try {
        const allUserData = await User.find();
        console.log(allUserData);
    
        res.status(201).json({"message": "success", "users": allUserData});
    } catch(err) {
        res.status(500).json({"error": err});
    }
}

export const getOneUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({_id: id});

        res.status(201).json({"user": user});
    } catch (err) {
        res.status(400).json({"error": err});
    }
}

export const getUsersForSidebar = async (req, res) => {
    try {   
        const loggedInUserId = req.user.id;

        const users = await User.find({_id: {$ne: loggedInUserId} }).lean();

        const usersWithLatestMessage = await Promise.all(
            users.map(async (user) => {
                const latestMessage = await Message.findOne({
                    $or: [
                        { senderId: loggedInUserId, receiverId: user._id },
                        { senderId: user._id, receiverId: loggedInUserId }
                    ]
                }).sort({ createdAt: -1 });

                return {
                    ...user,
                    latestMessageAt: latestMessage ? latestMessage.createdAt : new Date(0)
                };
            })
        );

        usersWithLatestMessage.sort((a, b) => b.latestMessageAt - a.latestMessageAt);

        return res.status(200).json({"users": usersWithLatestMessage});
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({"Error": "INTERNAL SERVER ERROR"});
    }
}