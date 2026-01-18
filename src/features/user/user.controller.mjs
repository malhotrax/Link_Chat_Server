import { ApiError } from "../../util/apiError.mjs";
import { ApiResponse } from "../../util/apiResponse.mjs";
import { asyncHandler } from "../../util/asyncHandler.mjs";
import { UserService } from "./user.service.mjs";
import { Validator } from "../../util/validator.mjs";

const options = {
	httpOnly: true,
	secure: true,
};

export const UserController = {
	createUser: asyncHandler(async (request, response) => {
		if (!request.body) {
			throw new ApiError(400, "Request body is missing.");
		}
		const { username, password, email, fullName, dateOfBirth } =
			request.body;
		let validationErrors = [];

		if (Validator.checkUsername(username) === false) {
			validationErrors.push(
				"Invalid username. It must be at least 3 characters long.",
			);
		}
		if (Validator.checkPassword(password) === false) {
			validationErrors.push(
				"Invalid password. It must be at least 6 characters long.",
			);
		}
		if (Validator.checkEmail(email) === false) {
			validationErrors.push("Invalid email format.");
		}
		if (validationErrors.length > 0) {
			throw new ApiError(400, "Validation Error", {
				errors: validationErrors,
			});
		}

		const userWithGivenEmailExists =
			await UserService.userExistsWithGivenEmail(email);
		if (userWithGivenEmailExists) {
			throw new ApiError(409, "User with this email already exists.");
		}

		const userWithGivenUsernameExists =
			await UserService.userExistsWithGivenUsername(username);
		if (userWithGivenUsernameExists) {
			throw new ApiError(409, "Username is already taken.");
		}

		const newUser = await UserService.createUser(
			username,
			password,
			email,
			fullName,
			dateOfBirth,
		);

		if (!newUser) {
			throw new ApiError(500, "Failed to create user.");
		}
		const { accessToken, refreshToken } = await UserService.generateTokens(
			newUser._id,
		);

		if (!accessToken || !refreshToken) {
			throw new ApiError(500, "Failed to create tokens.");
		}
		const userObj = newUser.toObject();
		const userData = {
			email: userObj.email,
			fullName: userObj.fullName,
			username: userObj.username,
		};
		return response
			.status(200)
			.cookie("access_token", accessToken, options)
			.cookie("refresh_token", refreshToken, options)
			.json(
				new ApiResponse(200, "Logged in successfully.", {
					refresh_token: refreshToken,
					access_token: accessToken,
					userData,
				}),
			);
	}),

	userWithGivenEmailExists: asyncHandler(async (request, response) => {
		if (!request.body) {
			throw new ApiError(400, "Request body is missing.");
		}
		const { email } = request.body;
		const userExists = await UserService.userExistsWithGivenEmail(email);
		if (!userExists) {
			throw new ApiError(404, "User with given email does not exist.");
		}
		return response
			.status(200)
			.json(new ApiResponse(200, "User exists", { exists: userExists }));
	}),

	userWithGivenUsernameExists: asyncHandler(async (request, response) => {
		if (!request.body) {
			throw new ApiError(400, "Request body is missing.");
		}
		const { username } = request.body;
		const userExists =
			await UserService.userExistsWithGivenUsername(username);
		if (!userExists) {
			throw new ApiError(404, "User with given username does not exist.");
		}
		return response
			.status(200)
			.json(new ApiResponse(200, "User exists", { exists: userExists }));
	}),

	login: asyncHandler(async (request, response) => {
		if (!request.body) {
			throw new ApiError(400, "Request body is missing.");
		}
		const { email, password } = request.body;
		const validationErrors = [];
		if (!email) {
			validationErrors.push("Email is empty.");
		}
		if (!password) {
			validationErrors.push("Password is empty.");
		}
		if (validationErrors.length > 0) {
			throw new ApiError(401, "Validation Error: " + validationErrors);
		}
		const user = await UserService.findUserByEmail(email);
		if (!user) {
			throw new ApiError(404, "No user found with given email.");
		}
		const isPasswordCorrect = await UserService.isPasswordCorrect(
			user._id,
			password,
		);
		if (!isPasswordCorrect) {
			throw new ApiError(401, "Incorrect password.");
		}

		const { accessToken, refreshToken } = await UserService.generateTokens(
			user._id,
		);

		if (!accessToken || !refreshToken) {
			throw new ApiError(500, "Failed to create tokens.");
		}
		const userObj = user.toObject();
		const userData = {
			email: userObj.email,
			fullName: userObj.fullName,
			username: userObj.username,
		};
		return response
			.status(200)
			.cookie("access_token", accessToken, options)
			.cookie("refresh_token", refreshToken, options)
			.json(
				new ApiResponse(200, "Logged in successfully.", {
					refresh_token: refreshToken,
					access_token: accessToken,
					userData,
				}),
			);
	}),
	refreshAccessToken: asyncHandler(async (request, response) => {}),

	blockUser: asyncHandler(async (request, response) => {}),
};
