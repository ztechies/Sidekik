import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    title: { type: String, required: true },
    template: { type: String, required: true }
},
    { timestamps: true }
);
const Email = mongoose.model('Email', emailSchema);
export default Email;