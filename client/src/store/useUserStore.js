import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStrore";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
	loading: false,

	updateProfile: async (data) => {
		console.log('data', data);
		try {
			set({ loading: true });
			const formData = new FormData();
			// Tambahkan field ke FormData
			formData.append('name', data.name);
			formData.append('bio', data.bio);
			formData.append('age', data.age);
			formData.append('gender', data.gender);
			formData.append('genderPreference',data.genderPreference);

			// Jika ada file gambar, tambahkan ke FormData
			if (data.image) {
				formData.append('image', data.image);
			}

			const res = await axiosInstance.put("/users/update", formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			useAuthStore.getState().setAuthUser(res.data.user);
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error(error.response.data.errors || "Something went wrong");
		} finally {
			set({ loading: false });
		}
	},
}));