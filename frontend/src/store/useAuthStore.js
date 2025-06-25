import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("check data", res);
            set({ authUser: res.data })
        } catch (err) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async(data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/register", data);
            toast.success("Account Created Successfully")
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false});
        }
    },

    login: async(data) => {
        set({isLoggingIng: true});
        try {
            const res = await axiosInstance.post("/login", data);
            console.log("useAuthStore me response:", res);
            // set({ authUser: res.data });
            toast.success("Successfull Logged In");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIng: false});
        }
    },

    logout: async() => {
        try {
            const res = await axiosInstance.get("/logout");
            toast.success("Logged Out Successfully");
            console.log(res);
        } catch (err) {
            toast.error(err.response.data.message);
        }
    },

    getUserForProfile: async(id) => {
        try {
            const res = await axiosInstance.get(`user/${id}`);
            return res.data.user;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

}))