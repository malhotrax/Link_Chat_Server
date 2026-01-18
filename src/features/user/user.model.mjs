import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		fullName: {
			type: String,
		},
		dateOfBirth: {
			type: String,
		},
		pending: [
			{
				id: String,
			},
		],
		friends: [
			{
				id: String,
			},
		],
		requests: [
			{
				id: String,
			},
		],
		blockedUsers: [
			{
				id: String,
			},
		],
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.hashedPassword);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.ACCESS_TOKEN_KEY,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXP,
		},
	);
};

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_KEY,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXP,
		},
	);
};

userSchema.pre("save", async function () {
	if (!this.isModified("hashedPassword")) return;
	this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
});

export const User = mongoose.model("User", userSchema);
