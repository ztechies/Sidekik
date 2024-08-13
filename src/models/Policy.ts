import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
    title: { type: String, required: true },
    template: { type: String, required: true },
    status: {type: String, enum: ['active', 'inActive'], required: true}
},
    { timestamps: true }
);
const Policy = mongoose.model('Policy', policySchema);
export default Policy;