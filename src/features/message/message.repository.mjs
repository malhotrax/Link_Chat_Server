import { Message } from "./message.model.mjs"

export const MessageRepository = {
    create: async (messageData) => {
        return await Message.create({
            senderId: messageData.senderId,
            receiverId: messageData.receiverId,
            content: messageData.content
        })
    },
    deleteById: async (messageId) => {
        return await Message.findByIdAndUpdate(messageId)
    },
    findById: async (messageId) => {
        return await Message.findById(messageId)
    },
    getMessages: async (chatId) => {
        return await Message.find({
            chatId: chatId
        })
    }
}