import mongoose from "mongoose";
import Group from "../model/Group.js";

export const createNewGroup = async (req, res) => {
    const {name, members, groupImage} = req.body;

    const adminId = req.user.id;

    if(!name) {
        return res.status(400).json({message: "Group name is required"});
    }

    const uniqueMembers = new Set(members || []);
    uniqueMembers.add(adminId);

    const group = new Group({
        name,
        admin: adminId,
        members: Array.from(uniqueMembers),
        groupImage,
    });

    await group.save();

    return res.status(200).json({message: "group created successfully", group});
}

export const addMembersToGroup = async (req, res) => {
    try {
        const {groupId, members} = req.body;
        const adminId = req.user.id;
    
        const group = await Group.findById(groupId);
        if(!group) {
            return res.status(404).json({message: "Group Not Found"});
        }
    
        if(group.admin.toString() !== adminId.toString()) {
            return res.status(400).json({message: "Only Admin Can add Members"});
        }
    
        const currentMembers = new Set(group.members.map(id => id.toString()));
        members.forEach(id => currentMembers.add(id));
    
        group.members = Array.from(currentMembers);
    
        await group.save();
    
        return res.status(200).json({message: "Members added successfully", group});
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

export const removeMembersFromGroup = async (req, res) => {
    try {
        const {groupId, memberId} = req.body;
        const adminId = req.user.id;
    
        const group = await Group.findById(groupId);
    
        if(!group) {
            return res.status(404).json({message: "Group Not Found"});
        }
    
        if(group.adminId.toString() !== adminId.toString()) {
            return res.status(400).json({message: "Only Admin can Remove members"});
        }
    
        if(memberId == adminId) {
            return res.status(400).json({message: "Admin Cannot remove Themselves"});
        }
    
        group.members = group.members.filter(
            id => id.toString() !== memberId.toString()
        );
    
        await group.save();
    
        return res.status(200).json({message: "success", group})
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

export const leaveGroup = async (req, res) => {
    try {
        const {groupId} = req.params;
        const memberId = req.user.id;
    
        const group = await Group.findById(groupId);
    
        if(!group) {
            return res.status(404).json({message: "Group Not Found"});
        }
    
        if(group.adminId.toString() === memberId.toString()) {
            return res.status(400).json({message: "Kindly delete the group if you want to leave"});
        }
    
        group.members = group.members.filter(id => id.toString() !== memberId);
    
        await group.save();
    
        return res.status(200).json({message: `Member: ${memberId} Left Successfully`});
    } catch (err) {
        return res.status(500).json(err);
    }
}

