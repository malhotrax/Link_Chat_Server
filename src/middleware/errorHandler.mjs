import { ApiError } from "../util/apiError.mjs";

export const errorHandler = (err, req, res, next) => {
	// If it's a known API error
	if (err instanceof ApiError) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
			code: err.statusCode,
		});
	}

	// Unknown / programming error
	console.error(err);

	return res.status(500).json({
		success: false,
		message: "Internal Server Error",
		code: 500,
	});
};
