import { MessageService } from "../service/messageService.mjs";
import { ApiError } from "../util/apiError.mjs";
import { asyncHandler } from "../util/asyncHandler.mjs";

export const UserController = {

    sendMessage:  asyncHandler(async (request, response) => {
    if(!request.user || !request.user.id){
        throw new ApiError(401, "Unauthorized: User information is missing.");
    }

    const senderId = request.user.id;

    if(!request.body){
        throw new ApiError(400, "Request body is missing");
    }
    let validationErrors = [];
    const { receiverId, content } = request.body;
    
    if(!senderId){
        validationErrors.push("Sender ID is required.");
    }
    if(!receiverId){
        validationErrors.push("Receiver ID is required.");
    }
    if(!content){
        validationErrors.push("Content is required.");
    }
    if(validationErrors.length > 0){
        throw new ApiError(400, "Validation errors", validationErrors);
    }

    const newMessage = await MessageService.createMessage(
        senderId,
        receiverId,
        content
    );
    
}),

}

