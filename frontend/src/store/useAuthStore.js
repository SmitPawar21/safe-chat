import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from 'react-hot-toast';
import {io} from "socket.io-client";

const BACKEND_URL = "http://localhost:3000"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

    socket: null,
    isInitialized: false,

    onlineUsers: [], // list for keys of "userSocketMap" [refer backend/lib/socket.js]

    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("check data", res);
            
            // Only connect socket if user wasn't already authenticated
            const wasAuthenticated = get().authUser !== null;
            set({ authUser: res.data.id });

            // Only connect if we weren't previously authenticated
            if (!wasAuthenticated) {
                get().connectSocket();
            }
        } catch (err) {
            set({ authUser: null });
            // Disconnect socket if auth check fails
            get().disconnectSocket();
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
            set({isSigningUp: false})
        }
    },

    login: async(data) => {
        set({isLoggingIng: true});
        try {
            const res = await axiosInstance.post("/login", data);
            console.log("useAuthStore me response:", res);
            set({ authUser: res.data.id });
            toast.success("Successfull Logged In");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIng: false});
        }
    },

    logout: async() => {
        try {
            const res = await axiosInstance.get("/logout");
            set({authUser: null});
            toast.success("Logged Out Successfully");
            console.log(res);
            get().disconnectSocket();
        } catch (err) {
            toast.error(err.response.data.message);
        }
    },

    getUserDataById: async(id) => {
        try {
            const res = await axiosInstance.get(`user/${id}`);
            return res.data.user;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    },

    connectSocket: () => {
        const {authUser, socket} = get();

        if(!authUser || (socket && socket.connected)) {
            console.log("Socket connection skipped:", { 
                hasUser: !!authUser, 
                socketConnected: socket?.connected 
            });
            return;
        }

        const newSocket = io(BACKEND_URL, {
            forceNew: false,
            reconnection: true,
            timeout: 5000,
            query: {
                userId: authUser
            }
        });
        
        console.log("connectSocket done for user:", authUser);
        set({socket: newSocket});

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })

    },

    disconnectSocket: () => {
        const {socket} = get();
        if(socket && socket.connected) {
            socket.disconnect();
            console.log("socket disconnected");
            set({socket: null});
        }
    }
}));