import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
	participants: [
		{
			participantId: String,
		},
	],
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});
export const Chat = mongoose.model("Chat", chatSchema);
