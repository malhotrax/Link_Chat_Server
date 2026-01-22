import { UserService } from "../features/user/user.service.mjs";
import { ApiError } from "../util/apiError.mjs";
import { asyncHandler } from "../util/asyncHandler.mjs";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (request, _, next) => {
	const token =
		request.cookies?.accessToken ||
		request.header("Authorization").replace("Bearer", "");
	if (!token) {
		throw new ApiError(401, "Invalid token or not found.");
	}
	const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
	const user = await UserService.findUserById(decodeToken?._id);

	if (!user) {
		throw new ApiError(401, "Unauthorized user.");
	}
	request.user = user;
	next();
});
