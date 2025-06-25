import express from "express";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";

export const registerUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const savedUser = await User.create({
            username: username,
            password: hashedPassword,
        });

        return res.status(201).json({message: 'user created successfully', user: savedUser});
    } catch (err) {
        console.log(err);
        return res.status(400).json({"error": err});
    }
}

export const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if((!user || !(await bcrypt.compare(password, user.password)))) {
            return res.status(201).json({"message": "invalid credentials"});
        }

        const token = generateToken(user._id, res);
        return res.status(201).json({"token": token});
    } catch (err) {
        console.log(err);
        return res.status(400).json({"error": err});
    }
}

export const checkAuth = async(req, res) => {
    try {
        const user = req.user;
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({"error": "INTERNAL SERVER ERROR"});
    }
}

export const logoutUser = async(req, res) => {
    try {
        res.cookie("jwt-token", "", {maxAge: 0});
        res.status(201).json({"message": "Logout successfull"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({"error": "INTERNAL SERVER ERROR"});
    }
}