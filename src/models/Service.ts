import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true }
);
const Service = mongoose.model('Service', serviceSchema);
export default Service;