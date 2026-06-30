import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({

    userSelected: false,

    groupSelected: false,

    users: [],

    groups: [],

    usersForSidebar: async () => {
        const res = await axiosInstance.get("/users");
        console.log(res.data.users);
        set({ users: res.data.users });
        return res.data.users;
    },

    groupsForSidebar: async () => {
        const res = await axiosInstance.get("/group/groups-for-user");
        console.log(res.data.groups);
        set({ groups: res.data.groups });
        return res.data.groups;
    },

    userSelectedId: null,

    groupSelectedId: null,

    messages: [],

    getGroupDataById: async (id) => {
        const res = await axiosInstance.get(`group/${id}`);
        console.log(res.data.group);
        console.log(res.data.messages);

        set({ messages: res.data.messages });

        return res.data;
    },

    selectedUserData: async (id) => {
        const res = await axiosInstance.get(`/message/${id}`);
        set({ messages: res.data.messages });
        return res.data.messages;
    },

    sendMessage: async (text, image, receiverId, groupId) => {
        const res = await axiosInstance.post("/message/send", {
            text: text,
            image: image,
            receiverId: receiverId,
            groupId: groupId
        });
        console.log(res);

        // Reorder locally for sender
        if (receiverId) {
            const { users } = get();
            const updatedUsers = [...users];
            const userIndex = updatedUsers.findIndex(u => u._id === receiverId);
            if (userIndex !== -1) {
                const [userToMove] = updatedUsers.splice(userIndex, 1);
                updatedUsers.unshift(userToMove);
                set({ users: updatedUsers });
            }
        }
    },

    subscribeToMessages: (socket) => {
        socket.off("newMessage");
        socket.on("newMessage", (newMessage) => {
            const { users } = get();
            const otherUserId = newMessage.senderId;
            
            // 1. Reorder sidebar users
            const updatedUsers = [...users];
            const userIndex = updatedUsers.findIndex(u => u._id === otherUserId);
            if (userIndex !== -1) {
                const [userToMove] = updatedUsers.splice(userIndex, 1);
                updatedUsers.unshift(userToMove);
                set({ users: updatedUsers });
            }
            
            // 2. Append message if active chat
            if (get().userSelectedId === otherUserId) {
                set({ messages: [...get().messages, newMessage] });
            }
        });
    },

    realTimeMessageForGroup: () => {
        const { groupSelectedId } = get();
        if ((!groupSelectedId)) return;

        const socket = useAuthStore.getState().socket;

        socket.off("newGroupMessage");

        socket.on("newGroupMessage", (newGroupMessage) => {
            set({ messages: [...get().messages, newGroupMessage] });
        })
    },



    offRealTimeMessageForGroup: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newGroupMessage");
    }
}))