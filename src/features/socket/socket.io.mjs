import { Server } from "socket.io";
import app from "../../app.mjs";
import http from "http";
import { SocketController } from "./socket.controller.mjs";
import { socketAuth } from "../../middleware/socket.auth.mjs";

const server = http.createServer(app);
const io = new Server(server);

export const ONLINE_USERS = new Map();

io.use(socketAuth);

io.on("connection", (socket) => {
	console.log("New client connected:", socket.id);

	socket.on("user_connected", (userId) => {
		SocketController.userConnected(userId);
	});

	socket.on("send_friend_request", (userId) => {
		SocketController.sendFriendRequest(socket.user._id, userId, socket);
	});

	socket.on("accept_friend_request", (userId) => {
		SocketController.acceptFriendRequest(socket.user._id, userId, socket);
	});

	socket.on("send_message", (senderId, chatId, content) => {
		SocketController.sendMessage(senderId, chatId, content, socket);
	});

	socket.on("disconnect", () => {
		SocketController.userDisconnected(socket);
	});
});

export default server;
