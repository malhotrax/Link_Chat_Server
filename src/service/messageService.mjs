import { messageRepository } from "../repository/messageRepository.mjs";

export class MessageService {
    static async createMessage(
        senderId,
        receiverId,
        content
    ) {
        const message = await messageRepository.create({
            senderId,
            receiverId,
            content
        });
        return message;
    }
}