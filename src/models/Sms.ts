import mongoose from "mongoose";

const smsSchema = new mongoose.Schema({
    title: { type: String, required: true },

    template: { type: String, required: true }
},
    { timestamps: true }
);
const Sms = mongoose.model('Sms', smsSchema);
export default Sms;