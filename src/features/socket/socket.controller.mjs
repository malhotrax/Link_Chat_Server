import { UserService } from "../user/user.service.mjs";
import { ChatService } from "../chat/chat.service.mjs";
import { MessageService } from "../message/message.service.mjs";
import { MessageDeliveryStatus } from "../../util/deliveryStatus.mjs";

export const SocketController = {
	userConnected: async (userId, socket) => {
		global.onlineUsers.set(userId, socket.id);
		const messages = await MessageService.findUndeliveredMessages(userId);
		if (messages || messages.length > 0) {
			socket.emit("undelivered_messages", messages);
		}
		return;
	},
	sendFriendRequest: async (fromUserId, toUserId, socket) => {
		try {
			if (fromUserId === toUserId) {
				socket.emit("error", {
					message: "You cannot send a friend request to yourself.",
				});
				return;
			}
			const friend = await UserService.getUserById(toUserId);
			if (!friend) {
				socket.emit("error", { message: "User not found." });
				return;
			}
			await UserService.sendFriendRequest(fromUserId, toUserId);
			socket.emit("alert", {
				message: `Friend request sent successfully to ${friend.username}.`,
			});
			return;
		} catch (error) {
			socket.emit("error", { message: error.message });
		}
	},

	acceptFriendRequest: async (fromUserId, toUserId, socket) => {
		try {
			const friend = await UserService.getUserById(toUserId);
			if (!friend) {
				socket.emit("error", { message: "User not found." });
				return;
			}
			await UserService.acceptFriendRequest(fromUserId, toUserId);
			socket.emit("alert", {
				message: `Congratulations, ${friend.username} is now your friend.`,
			});
			return;
		} catch (error) {
			socket.emit("error", { message: error.message });
		}
	},
	rejectFriendRequest: async (fromUserId, toUserId, socket) => {
		try {
			const friend = await UserService.getUserById(toUserId);
			if (!friend) {
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
	sendMessage: async (senderId, content, chatId, socket) => {
		try {
			const sender = await UserService.getUserById({ _id: senderId });
			if (!sender) {
				socket.emit("error", {
					message: "Sender with given Id not found",
				});
			}
			const chat = await ChatService.findChatById(chatId);
			if (!chat) {
				socket.emit("error", {
					message: "Chat with given Id not found",
				});
			}
			const newMessage = await MessageService.createMessage(
				(chatId = chat._id),
				(senderId = senderId),
				(content = content),
				(deliveryStatus = MessageDeliveryStatus.SENT),
			);
			await ChatService.addMessage(chatId, newMessage);

			for (const userId in chat.participants) {
				const socketId = global.onlineUsers.get(userId);
				if (socketId) {
					socket.to(socketId).emit("message_received", newMessage);
					await MessageService.markDeliveryStatusDelivered(
						newMessage._id,
						userId,
					);
				}
			}
		} catch (error) {
			pdateDeliveryStatus(MessageDeliveryStatus.DELIVERED);
			socket.emit("error", { message: error.message });
		}
	},
};
