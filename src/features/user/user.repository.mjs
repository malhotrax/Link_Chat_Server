import { User } from "../user/user.model.mjs";

export const UserRespository = {
	create: async (userData) => {
		return await User.create({
			username: userData.username,
			hashedPassword: userData.password,
			email: userData.email,
			fullName: userData.fullName,
			dateOfBirth: userData.dateOfBirth,
		});
	},

	deleteById: async (userId) => {
		return await User.findByIdAndDelete(userId);
	},

	findById: async (userId) => {
		return await User.findById(userId);
	},
	findByUsername: async (username) => {
		return await User.findOne({ username });
	},

	findByEmail: async (email) => {
		return await User.findOne({ email });
	},

	isPasswordCorrect: async (userId, password) => {
		const user = await User.findById(userId);
		return await user.isPasswordCorrect(password);
	},
	generateTokens: async (userId) => {
		const user = await User.findById(userId);
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		await User.updateOne(
			{ _id: user._id },
			{
				$set: {
					refreshToken: refreshToken,
				},
			},
		);
		return { accessToken, refreshToken };
	},
	updateUsernameById: async (userId, newUsername) => {
		return await User.findByIdAndUpdate(
			userId,
			{ username: newUsername },
			{ new: true },
		);
	},

	updatePasswordById: async (userId, newPassword) => {
		const user = await User.findById(userId);
		user.password = newPassword;
		return await user.save({ validateBeforeSave: false });
	},

	addFriendRequest: async (fromUserId, toUserId) => {
		await User.findByIdAndUpdate(
			{ _id: toUserId },
			{
				$push: {
					requests: {
						id: fromUserId,
					},
				},
			},
		);

		await User.findByIdAndUpdate(
			{ _id: fromUserId },
			{
				$push: {
					pending: {
						id: toUserId,
					},
				},
			},
		);
	},
	acceptFriendRequest: async (fromUserId, toUserId) => {
		await User.findByIdAndUpdate(
			{
				_id: fromUserId,
			},
			{
				$push: {
					friends: {
						id: toUserId,
					},
				},
				$pull: {
					requests: {
						id: toUserId,
					},
				},
			},
		);

		await User.findByIdAndUpdate(
			{
				_id: toUserId,
			},
			{
				$push: {
					friends: {
						id: fromUserId,
					},
				},
				$pull: {
					pending: {
						id: fromUserId,
					},
				},
			},
		);
	},

	blockUserById: async (userId, blockedUserId) => {
		await User.findByIdAndUpdate(
			{
				_id: userId,
			},
			{
				$push: {
					blocked: {
						id: blockedUserId,
					},
				},
				$pull: {
					friends: {
						id: blockedUserId,
					},
				},
			},
		);
	},

	deleleFromFriendsById: async (userId, friendId) => {
		await User.findByIdAndUpdate(
			{
				_id: userId,
			},
			{
				$pull: {
					friends: {
						id: friendId,
					},
				},
			},
		);
	},

	rejectFriendRequest: async (fromUserId, toUserId) => {
		await User.findByIdAndUpdate(
			{
				_id: fromUserId,
			},
			{
				$pull: {
					requests: {
						id: toUserId,
					},
				},
			},
		);

		await User.findByIdAndUpdate(
			{
				_id: toUserId,
			},
			{
				$pull: {
					pending: {
						id: fromUserId,
					},
				},
			},
		);
	},
};
