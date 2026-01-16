import { Server } from "socket.io";
import app from "../server/app.mjs"
import http from "http";
import { UserService } from "../service/userService.mjs";
import { asyncHandler } from "../util/asyncHandler.mjs";
import { UserController } from "../controller/userController.mjs";

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
        const friend = UserService.getUserById(userId);
        if(!friend){
            socket.emit("user_not_found", { message: "User not found." });
        }
        UserController.sendFriendRequest(user._id, friend._id, socket)
    });

    socket.on("accept_friend_request", (userId) => {    
    });

    socket.on("send_message", (chatId,content, ) => {

    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});     

export default server;


