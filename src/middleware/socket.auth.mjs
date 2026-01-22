import jwt from "jsonwebtoken";
import { UserService } from "../features/user/user.service.mjs";

export const socketAuth = async (socket, next) => {
	try {
		const token = socket.handshake.auth?.token;
		if (!token) {
			return next(new Error("Unauthorized: Token missing"));
		}
		const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
		const user = await UserService.findUserById(decodeToken?._id);
		if (!user) {
			return next(new Error("Unauthorized: User not found"));
		}
		socket.user = user;
		next();
	} catch (error) {
		return next(new Error("Unauthorized: Invalid token"));
	}
};
