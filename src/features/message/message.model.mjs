import mongoose from "mongoose";
import { MessageDeliveryStatus } from "../../util/deliveryStatus.mjs";

const messageSchema = new mongoose.Schema(
	{
		chatId: {
			type: String,
			required: true,
			index: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		deliveryStatus: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				status: {
					type: String,
					enum: Object.values(MessageDeliveryStatus),
					default: MessageDeliveryStatus.SENT,
				},
				updatedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		timestamp: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	},
);

export const Message = mongoose.model("Message", messageSchema);
