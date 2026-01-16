import { ApiError } from "../../util/apiError.mjs";
import { ApiResponse } from "../../util/apiResponse.mjs";
import { asyncHandler } from "../../util/asyncHandler.mjs";
import { UserService } from "./user.service.mjs";
import { Validator } from "../../util/validator.mjs"

export const UserController = {
    createUser: asyncHandler(async (req, res) => {
        if (!req.body) {
            throw new ApiError(400, "Request body is missing.");
        }
        const { username, password, email, fullName, dateOfBirth } = req.body;
        let validationErrors = [];

        if (Validator.checkUsername(username) === false) {
            validationErrors.push("Invalid username. It must be at least 3 characters long.");
        }
        if (Validator.checkPassword(password) === false) {
            validationErrors.push("Invalid password. It must be at least 6 characters long.");
        }
        if (Validator.checkEmail(email) === false) {
            validationErrors.push("Invalid email format.");
        }
        if (validationErrors.length > 0) {
            throw new ApiError(400, "Validation Error", { errors: validationErrors });
        }

        const userWithGivenEmailExists = await UserService.userExistsWithGivenEmail(email)
        if (userWithGivenEmailExists) {
            throw new ApiError(409, "User with this email already exists.");
        }

        const userWithGivenUsernameExists = await UserService.userExistsWithGivenUsername(username)
        if (userWithGivenUsernameExists) {
            throw new ApiError(409, "Username is already taken.");
        }

        const newUser = await UserService.createUser(
            username,
            password,
            email,
            fullName,
            dateOfBirth
        );

        if (!newUser) {
            throw new ApiError(500, "Failed to create user.");
        }
        return res
            .status(201)
            .json(new ApiResponse(201, "User created successfully", { userId: newUser._id, username: newUser.username, email: newUser.email }));
    }),

    userWithGivenEmailExists: asyncHandler(async (req, res) => {
        if (!req.body) {
            throw new ApiError(400, "Request body is missing.");
        }
        const { email } = req.body;
        const userExists = await UserService.userExistsWithGivenEmail(email);
        if (!userExists) {
            throw new ApiError(404, "User with given email does not exist.");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "User exists", { exists: userExists }));
    }),

    userWithGivenUsernameExists: asyncHandler(async (req, res) => {
        if (!req.body) {
            throw new ApiError(400, "Request body is missing.");
        }
        const { username } = req.body;
        const userExists = await UserService.userExistsWithGivenUsername(username);
        if (!userExists) {
            throw new ApiError(404, "User with given username does not exist.");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "User exists", { exists: userExists }));
    }),

    login: asyncHandler(async (req, res) =>  {

    }),

    blockUser:  asyncHandler(async (req, res) => {

    })

}