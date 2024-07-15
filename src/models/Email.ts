import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    title: { type: String, required: true },
    template: { type: String, required: true }
},
    { timestamps: true }
);
const Email = mongoose.model('email', emailSchema);
export default Email;