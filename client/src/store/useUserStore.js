import toast from 'react-hot-toast';
import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
// import { useAuthStore } from './useAuthStrore';

export const useUserStore = create((set) => ({
    loading: false,
    updateProfile: async (data) => {
		try {
			set({ loading: true });
			await axiosInstance.put("/users/update", data);
			// useAuthStore.getState().setAuthUser(res.data.user);
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error(error.response.data.errors || "Something went wrong");
		} finally {
			set({ loading: false });
		}
	},
}))