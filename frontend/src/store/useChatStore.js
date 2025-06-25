import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from 'react-hot-toast';

export const useChatStore = create((set) => ({

    userSelected: false,

    usersForSidebar: async() => {
        const res = await axiosInstance.get("/users");
        console.log(res.data.users);
        return res.data.users;
    },

    userSelectedId: "",

    selectedUserData: async(id) => {
        const res = await axiosInstance.get(`/message/${id}`);
        return res.data.messages;
    },

    sendMessage: async(id, text, image) => {
        const res = await axiosInstance.post(`/message/send/${id}`, {
            text: text,
            image: image
        });
        console.log(res);
    }

}))