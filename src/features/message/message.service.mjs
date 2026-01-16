import { MessageRepository } from "./message.repository.mjs";

export class MessageService {
    static async createMessage(
        chatId,
        senderId,
        content
    ) {
        const message = await MessageRepository.create({
            chatId,
            senderId,
            content
        });
        return message;
    }

    static async deleteMessage(messageId) {
        return await MessageRepository.deleteById(messageId)
    }

    static async getMessage(messageId) {
        return await MessageRepository.findById(messageId)
    }

    static async getMessages(chatId) {
        return await MessageRepository.getMessages(chatId)
    }
}