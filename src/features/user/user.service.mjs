import { UserRespository } from "../user/user.repository.mjs";

export class UserService {
	static async createUser(username, password, email, fullName, dateOfBirth) {
		const user = await UserRespository.create({
			username,
			password,
			email,
			fullName,
			dateOfBirth,
		});
		return user;
	}

	static async findUserById(userId) {
		return await UserRespository.findById(userId);
	}
	static async findUserByEmail(email) {
		return await UserRespository.findByEmail(email);
	}
	static async userExistsWithGivenEmail(email) {
		const user = await UserRespository.findByEmail(email);
		return user !== null;
	}

	static async userExistsWithGivenUsername(username) {
		const user = await UserRespository.findByUsername(username);
		return user !== null;
	}

	static async loginUser(email, password) {}
	static async deleteAccount(userId) {
		return await UserRespository.deleteById(userId);
	}
	static async updateUsername(userId, newUsername) {
		return await UserRespository.updateUsernameById(userId, newUsername);
	}
	static async updatePassword(userId, newPassword) {
		return await UserRespository.updatePasswordById(userId, newPassword);
	}
	static async sendFriendRequest(userId, friendId) {
		return await UserRespository.addFriendRequest(userId, friendId);
	}
	static async acceptFriendRequest(fromUserId, toUserId) {
		return await UserRespository.acceptFriendRequest(fromUserId, toUserId);
	}
	static async blockUser(userId, blockedUserId) {
		return await UserRespository.blockUserById(userId, blockedUserId);
	}
	static async unfriendUser(userId, friendId) {
		return await UserRespository.deleleFromFriendsById(userId, friendId);
	}
	static async rejectFriendRequest(fromUserId, toUserId) {
		return await UserRespository.rejectFriendRequest(fromUserId, toUserId);
	}

	static async isPasswordCorrect(userId, password) {
		return await UserRespository.isPasswordCorrect(userId, password);
	}

	static async generateTokens(userId) {
		return await UserRespository.generateTokens(userId);
	}
}
