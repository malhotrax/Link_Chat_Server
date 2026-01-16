import { Chat } from "./chat.model.mjs"

export const ChatRepository = {

    create: async (chatData) => {
        return await Chat.create({
            participants: chatData.participants,
            messages: chatData.messages || []
        })
    },

    addParticipant: async (chatId, userId) => {
        return await Chat.findByIdAndDelete(
            {
                _id: chatId
            },
            {
                $push: {
                    participants: userId
                }
            }
        )
    },

    removeParticipant: async (chatId, userId) => {
        return await Chat.findByIdAndDelete(
            {
                _id: chatId
            },
            {
                $pull: {
                    participants: userId
                }
            }
        )
    },

    addMessage: async (chatId, message) => {
        return await Chat.findByIdAndUpdate(
            {
                _id: chatId
            }, {
                $push: {
                    messages: {
                        message
                    }
                }
            }
        )
    },
    
    deleteById: async (chatId) => {
        return await Chat.findByIdAndDelete(chatId)
    },
    findById: async (chatId) => {
        return await Chat.findById(chatId)
    },
    findChatsByUserId: async (userId) => {
        return await Chat.find({ participants: userId })
    },

}