import { ApiError } from "../../util/apiError.mjs"
import { ApiResponse } from "../../util/apiResponse.mjs";
import { asyncHandler } from "../../util/asyncHandler.mjs"
import { UserService } from "../user/user.service.mjs";
import { ChatService } from "./chat.service.mjs";

export const ChatController = {
    createChat: asyncHandler(async (request, response) => {
        if (!request.user || !request.user._id) {
            throw new ApiError(401, "Unauthorized: User information is missing.");
        }
        if (!request.body) {
            throw new ApiError(400, "Request body is missing.");
        }
        const { participants } = request.body;

        if (!participants) {
            throw new ApiError(400, "Without participants chat can not be created!")
        }

        for (const userId in participants) {
            const participant = await UserService.findUserById(userId)
            if (!participant) {
                throw new ApiError(404, "Participant with given Id not found.")
            }
        }
        const chat = await ChatService.create(
            participants = participants,
            messages = []
        )

        if (!chat) {
            throw new ApiError(500, "Internal api error.")
        }

        return response
            .status(200)
            .json(new ApiResponse(
                200,
                "Chat created successfully",
                { chatId: chat._id },
            ))

    }),

    addParticipant: asyncHandler(async (request, response) => {
        if (!request.user || !request.user._id) {
            throw new ApiError(401, "Unauthorized: User information is missing.");
        }
        if (!request.body) {
            throw new ApiError(400, "Request body is missing.");
        }
        const { chatId, participantId } = request.body;

        let validationErrors = [];

        if (!chatId) {
            validationErrors.push("Chat id not found.")
        }
        if (!participantId) {
            validationErrors.push("New participant id not found.")
        }

        if (validationErrors.length > 0) {
            throw new ApiError(400, `Invalid detials: ${validationErrors}`)
        }
        const chat = await ChatService.findChatById(chatId)
        if (!chat) {
            throw new ApiError(404, "No chat found with given Id.")
        }
        const participant = await UserService.findUserById(participantId)
        if (!participant) {
            throw new ApiError(404, "No user found with given Id.")
        }
        await ChatService.addParticipant(chat._id, participant._id)

        return response
            .status(200)
            .json(new ApiResponse(200, "Added successfully."))

    }),

    removeParticipant: asyncHandler(async (request, response) => {
        if (!request.user || !request.user._id) {
            throw new ApiError(401, "Unauthorized: User information is missing.");
        }
        if (!request.body) {
            throw new ApiError(400, "Request body is missing.");
        }
        const { chatId, participantId } = request.body;

        let validationErrors = [];

        if (!chatId) {
            validationErrors.push("Chat id not found.")
        }
        if (!participantId) {
            validationErrors.push("New participant id not found.")
        }

        if (validationErrors.length > 0) {
            throw new ApiError(400, `Invalid detials: ${validationErrors}`)
        }
        const chat = await ChatService.findChatById(chatId)
        if (!chat) {
            throw new ApiError(404, "No chat found with given Id.")
        }
        const participant = await UserService.findUserById(participantId)
        if (!participant) {
            throw new ApiError(404, "No user found with given Id.")
        }
        await ChatService.removeParticipant(chat._id, participant._id)

        return response
            .status(200)
            .json(new ApiResponse(200, "Removed successfully."))
    }),

    getChatsByUserId: asyncHandler(async (request, response) => {
        if (!request.user || !request.user._id) {
            throw new ApiError(401, "Unauthorized: User information is missing.");
        }
        const chats = await ChatService.findChatsByUserId(request.user._id)
        if (!chats || chats.length === 0) {
            throw new ApiError(404, "No chats found")
        }
        return response
            .status(200)
            .json(new ApiResponse(200, "Successfully fetched chats.", { chats }))
    }),

    deleteChat: asyncHandler(async (request, response) => {
        if (!request.user || !request.user._id) {
            throw new ApiError(401, "Unauthorized: User information is missing.");
        }
        if (!request.body) {
            throw new ApiError(400, "Request body is missing.");
        }
        const { chatId } = request.body;
        if (!chatId) {
            throw new ApiError(400, "Invalid chat Id")
        }
        const chat = await ChatService.findChatById(chatId)
        if (!chat) {
            throw new ApiError(404, "No chat found with given Id.")
        }
        await ChatService.deleteChat(chatId)

        return response
            .status(200)
            .json(new ApiResponse(200, "Chat deleted successfully."))
    }),

    findChatById: asyncHandler(async (request, response) => {
        if (!request.user || !request.user._id) {
            throw new ApiError(401, "Unauthorized: User information is missing.");
        }
        if (!request.body) {
            throw new ApiError(400, "Request body is missing.");
        }
        const { chatId } = request.body;
        if (!chatId) {
            throw new ApiError(400, "Invalid chat Id")
        }
        const chat = await ChatService.findChatById(chatId)
        if (!chat) {
            throw new ApiError(404, "No chat found with given Id.")
        }
        return response
            .status(200)
            .json(new ApiResponse(200, "Chat fetched successfully.", { chat }))
    })
}