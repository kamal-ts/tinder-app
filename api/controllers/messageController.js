import { ResponseError } from "../error/response-error.js";
import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

const sendMessage = async (req, res, next) => {
    try {
        const {content, receiverId} = req.body;
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });
        // socket
        const connectedUsers = getConnectedUsers();
        const io = getIO();
        const receiverSocketId = connectedUsers.get(receiverId);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                message: newMessage
            })
        }

        res.status(201).json({
            data: newMessage
        })

    } catch (error) {
        next(error);
    }
}

const getConversation = async (req, res, next) => {
    try {
        const {userId} = req.params;
        // Validasi input
        if (!userId) {
            throw new ResponseError(400, "Missing userId ");
        };

        const message = await Message.find({
            $or: [
                {sender: req.user._id, receiver: userId},
                {sender: userId, receiver: req.user._id},

            ]
        });
        res.status(200).json({
            data: message
        })
    } catch (error) {
        next(error);
    }
}

export default {
    sendMessage,
    getConversation
}