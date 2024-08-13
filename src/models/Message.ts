import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default:false
    }
},
    {
        timestamps: true
    });

const Message = mongoose.model('Message', MessageSchema);

export default Message;