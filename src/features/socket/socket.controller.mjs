import { emit } from "cluster";
import { UserService } from "../user/user.service.mjs"

export const SocketController = {
    sendFriendRequest: async (fromUserId, toUserId, socket) => {
        try {
            if(fromUserId === toUserId){
                socket.emit("error", { message: "You cannot send a friend request to yourself." });
                return;
            }
            const friend = await UserService.getUserById(toUserId);
            if(!friend){
                socket.emit("error", { message: "User not found." });
                return;
            }
            await UserService.sendFriendRequest(fromUserId, toUserId);
            socket.emit("alert", { message: `Friend request sent successfully to ${friend.username}.` });
            return;

        } catch (error) {
            socket.emit("error", { message: error.message });
        }
    },

    acceptFriendRequest: async (fromUserId, toUserId, socket) => {
        try {
            const friend = await UserService.getUserById(toUserId);
            if(!friend){
                socket.emit("error", { message: "User not found." });
                return;
            }
            await UserService.acceptFriendRequest(fromUserId, toUserId);
            socket.emit("alert", { message: `Congratulations, ${friend.username} is now your friend.` });
            return;

        } catch (error) {
            socket.emit("error", { message: error.message });
        }
    },
    rejectFriendRequest: async (fromUserId, toUserId, socket) => {
        try {
            const friend = await UserService.getUserById(toUserId);
            if(!friend){
                socket.emit("error", { message: "User not found." });
                return;
            }
            await UserService.rejectFriendRequest(fromUserId, toUserId);
            socket.emit("alert", { message: `Friend request rejected.` });
            return;

        } catch (error) {
            socket.emit("error", { message: error.message });
        }
    },
    sendMessage: async (senderId,content,chatId,socket) => {
        try {
            const sender = await UserService.getUserById({_id: senderId});
            if(!sender) {
                socket.emit("error",{message: "Sender with given Id not found"})
            }
            const chat = await ChatService.findChatById(chatId)
            if(!chat) {
                socket.emit("error",{message: "Chat with given Id not found"})
            }
            const newMessage = await MessageService.createMessage(
                chatId = chatId,
                senderId = senderId,
                content = content
            );
            await ChatService.addMessage(chatId, newMessage)
        } catch (error) {
            socket.emit("error",{message:error.message})
        }

    }
}