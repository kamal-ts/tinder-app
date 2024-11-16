import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { getSocket } from '../socket/socket.client';
import { useAuthStore } from './useAuthStrore';

export const useMessageStore = create((set) => ({
    messages: [],
    loading: true,

    sendMessage: async (content, receiverId) => {
        try {
            // set({ loading: true });
            set(state => ({
                messages: [
                    ...state.messages,
                    {   
                        sender: useAuthStore.getState().authUser._id,
                        content
                    }
                ]
            }))
            const result = await axiosInstance.post("/messages/send", {
                content,
                receiverId
            });
            console.log('message send', result.data);
            // set({ messages: result.data.data });
        } catch (error) {
            console.log('error', error);
            toast.error(error.response.data.errors || "Something went wrong");
        } finally {
            // set({ loading: false })
        }
    },

    getMessages: async (userId) => {
        try {
            set({ loading: true });
            const result = await axiosInstance.get("/messages/conversation/" + userId);
            set({ messages: result.data.data })

        } catch (error) {
            console.log('error', error);
            set({ messages: [] });
        } finally {
            set({ loading: false })
        }
    },

    subscribeToMessages: () => {
        const socket = getSocket();
        socket.on("newMessage", ({ message }) => {
            set(state => ({
                messages: [...state.messages, message]
            }))
        })
    },

    unsubscribeFromMessages: () => {
        const socket = getSocket();
        socket.off("newMessage");
    }
}))