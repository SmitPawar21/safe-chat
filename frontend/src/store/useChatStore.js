import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({

    userSelected: false,

    usersForSidebar: async() => {
        const res = await axiosInstance.get("/users");
        console.log(res.data.users);
        return res.data.users;
    },

    userSelectedId: "",

    messages: [],

    selectedUserData: async(id) => {
        const res = await axiosInstance.get(`/message/${id}`);
        set({messages: res.data.messages});
        return res.data.messages;
    },

    sendMessage: async(id, text, image) => {
        const res = await axiosInstance.post(`/message/send/${id}`, {
            text: text,
            image: image
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

    offRealTimeMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))