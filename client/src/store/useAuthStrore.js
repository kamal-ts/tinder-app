import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser:null,
    checkingAuth:true,
    loading: false,


    signup: async (signupData) => {
        try {
            set({loading:true});
            const result = await axiosInstance.post("/auth/signup", signupData);
            set({authUser: result.data.user});
            toast.success("Account created successfully");
        } catch (error) {
            console.log('error', error);
            toast.error( error.response.data.errors || "Something went wrong");
        }finally {
            set({loading: false})
        }
    },

    login: async (loginData) => {
        try {
            const result = await axiosInstance.post("/auth/login", loginData);
            set({authUser: result.data.user});
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.errors || "Something went wrong")
        }finally {
            set({loading: false})
        }
    },
    logout: async () => {
        try {
            const result = await axiosInstance.post("/auth/logout");
            if (result.status === 200 ) set({authUser: null});
        } catch (error) {
            toast.error(error.response.data.errors || "Something went wrong")
        }
    },

    checkAuth: async () => {
        try {
            const rest = await axiosInstance.get("/auth/me");
            set({authUser: rest.data.data})
        } catch (error) {
            set({authUser: null});
            console.log('error', error);
        }finally {
            set({checkingAuth: false});
        }
    },

    setAuthUser: (user) => set({ authUser: user }),
}))