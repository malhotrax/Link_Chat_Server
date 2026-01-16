export const messageRepository = {
    create: async (messageData) => {
        return await Message.create({
            senderId: messageData.senderId,
            receiverId: messageData.receiverId,
            content: messageData.content
        })
    },
    deleteById: async (messageId) => {

    },
    findById: async (messageId) => {

    },
    getMessages: async () => {

    }
}