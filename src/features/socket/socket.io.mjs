import { Server } from "socket.io";
import app from "../server/app.mjs"
import http from "http";
import { SocketController } from "./socket.controller.mjs";

const server = http.createServer(app);
const io = new Server(server);

global.onlineUsers = new Map();

io.on("connection", socket => {
    const user = socket.user;
    console.log("New client connected:", socket.id);

    socket.on("new_user_connected", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send_friend_request", (userId) => {
        SocketController.sendFriendRequest(socket.user._id, userId, socket);
    });

    socket.on("accept_friend_request", (userId) => {    
        SocketController.acceptFriendRequest(socket.user._id, userId, socket);
    });

    socket.on("send_message", (chatId,content, ) => {

    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});     

export default server;


