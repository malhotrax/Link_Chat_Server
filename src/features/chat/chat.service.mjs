import { ChatRepository } from "./chat.repository.mjs";

export class ChatService {

    static async createChat(participants, messages = []) {
        const chat = await ChatRepository.create({
            participants,
            messages
        });
        return chat;
    }

    static async addParticipant(chatId, userId) {
        const chat = await ChatRepository.addParticipant(chatId, userId);
        return chat;
    }

    static async removeParticipant(chatId, userId) {
        const chat = await ChatRepository.removeParticipant(chatId, userId);
        return chat;
    }

    static async findChatsByUserId(userId) {
        const chats = await ChatRepository.getChatsByUserId(userId);
        return chats;
    }

    static async deleteChat(chatId) {
        await ChatRepository.deleteById(chatId);
    }

    static async findChatById(chatId) {
        const chat = await ChatRepository.findById(chatId);
        return chat;
    }

    static async addMessage(chatId, message) {
        await ChatRepository.addMessage(chatId,message)
    }

    static async delieverMessage(message,socket) {
        
    }

}