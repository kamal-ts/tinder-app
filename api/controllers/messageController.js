const sendMessage = async (req, res, next) => {
    try {
        const {content, receiverId} = req.body;
        const newMessage = await Message.create({})
    } catch (error) {
        next(error);
    }
}

const getConversation = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

export default {
    sendMessage,
    getConversation
}