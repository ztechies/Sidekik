import { Message as MessageType, Read } from "../@types/message.types"
import { CustomError } from "../middleware/errorHandler";
import MessageModel from "../models/Message";
import Conversation from "../models/Conversation";

const getMessage = async (id: string) => {
    try {
        const messages = await MessageModel.find({ conversationId: id });
        return messages;

    } catch (error: any) {
        throw new CustomError(error.message || 'Failed to get messages', error.status || 500);
    }
};

const addMessage = async (message: MessageType) => {
    try {
        const newMessage = new MessageModel(message);

        await newMessage.save();
        await Conversation.findByIdAndUpdate(message.conversationId, { message: message.text });

        return 'Message has been sent successfully';

    } catch (error: any) {
        throw new CustomError(error.message || 'Failed to add message', error.status || 500);
    }
};

const readMessage = async (message: Read) => {
    try {
        const { receiverId, conversationId, senderId } = message;

        const result = await MessageModel.updateMany(
            { senderId: senderId, receiverId: receiverId, conversationId: conversationId, read: false },
            { $set: { read: true } }
        );

        if (result.modifiedCount > 0) {
            return 'Messages have been marked as read successfully';
        }
    } catch (error: any) {
        throw new CustomError(error.message || 'Failed to update messages', error.status || 500);
    }
};

const getUnreadMessage = async (message: Read) => {
    try {
        const { conversationId, senderId, receiverId } = message

        const count = await MessageModel.countDocuments({
            conversationId,
            senderId,
            receiverId,
            read: false
        });

        return count;

    } catch (error: any) {
        throw new CustomError(error.message || 'Failed to add message', error.status || 500);
    }
};


export default { getMessage, addMessage, readMessage, getUnreadMessage };