import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    members: {
        type: Array,
        required: true
    },
    message: {
        type: String,
        required: false
    }
},
    {
        timestamps: true
    }
);

const Conversation = mongoose.model('Conversation', ConversationSchema)

export default Conversation;