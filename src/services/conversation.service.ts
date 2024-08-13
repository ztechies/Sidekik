import { Conversation } from "../@types/conversation.types";
import { CustomError } from "../middleware/errorHandler";
import ConversationModel from "../models/Conversation";

const getConversation = async (conversation: Conversation) => {
    try {
        const senderId = conversation.senderId;
        const receiverId = conversation.receiverId;

        let response = await ConversationModel.findOne({ members: { $all: [receiverId, senderId] } });

        if (!response) {
            return ({ "error": 'No Conversation Found' })
        }
        return response;

    } catch (error: any) {
        throw new CustomError(error.message || 'Failed to get conversation', error.status || 500);
    }
};

const addConversation = async (conversation: Conversation) => {
    try {
        const senderId = conversation.senderId;
        const receiverId = conversation.receiverId;

        const exist = await ConversationModel.findOne({ members: { $all: [receiverId, senderId] } });

        if (!exist) {
            const newConversation = new ConversationModel({
                members: [senderId, receiverId]
            });

            const response = await newConversation.save();
            return response;
        }

    } catch (error: any) {
        throw new CustomError(error.message || 'Failed to add conversation', error.status || 500);
    }
};

export default { getConversation, addConversation };