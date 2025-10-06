import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({

    userSelected: false,

    groupSelected: false,

    usersForSidebar: async() => {
        const res = await axiosInstance.get("/users");
        console.log(res.data.users);
        return res.data.users;
    },

    groupsForSidebar: async() => {
        const res = await axiosInstance.get("/group/groups-for-user");
        console.log(res.data.groups);
        return res.data.groups;
    },

    userSelectedId: null,

    groupSelectedId: null,

    messages: [],

    getGroupDataById: async(id) => {
        const res = await axiosInstance.get(`group/${id}`);
        console.log(res.data.group);
        console.log(res.data.messages);
        
        set({messages: res.data.messages});

        return res.data;
    },

    selectedUserData: async(id) => {
        const res = await axiosInstance.get(`/message/${id}`);
        set({messages: res.data.messages});
        return res.data.messages;
    },

    sendMessage: async(text, image, receiverId, groupId) => {
        const res = await axiosInstance.post("/message/send", {
            text: text,
            image: image,
            receiverId: receiverId,
            groupId: groupId
        });
        console.log(res);
    },

    realTimeMessage: () => {
        const {userSelectedId} = get();
        if(!userSelectedId) return;

        const socket = useAuthStore.getState().socket;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            set({messages: [...get().messages, newMessage]});
        })
    },

    realTimeMessageForGroup: () => {
        const {groupSelectedId} = get();
        if((!groupSelectedId)) return;

        const socket = useAuthStore.getState().socket;

        socket.off("newGroupMessage");

        socket.on("newGroupMessage", (newGroupMessage) => {
            set({messages: [...get().messages, newGroupMessage]});
        })
    },

    offRealTimeMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    offRealTimeMessageForGroup: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newGroupMessage");
    }
}))