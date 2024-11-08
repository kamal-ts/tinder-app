import Message from "../models/Message.js";

const sendMessage = async (req, res, next) => {
    try {
        const {content, receiverId} = req.body;
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        // TODO: SEND THE MESSAGE IN REAL TIME => SOCKET.IO 
        res.status(201).json({
            data: newMessage
        })

    } catch (error) {
        next(error);
    }
}

const getConversation = async (req, res, next) => {
    const {userId} = req.params;
    try {
        const message = Message.find({
            $or: [
                {sender: req.user._id, receiver: userId},
                {sender: userId, receiver: req.user._id},

            ]
        })

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