import mongoose from "mongoose";

const TermsOfUseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    template: { type: String, required: true },
    status: {type: String, enum: ['active', 'inActive'], required: true}
},
    { timestamps: true }
);
const TermsOfUse = mongoose.model('TermsOfUse', TermsOfUseSchema);
export default TermsOfUse;