export const socketHandler = (fun) => {
	return async (payload, socket) => {
		return Promise.resolve(fun(payload, socket)).catch((err) => {
			socket.emit("error", { message: err.message });
		});
	};
};
