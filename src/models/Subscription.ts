import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    discount: { type: Number, required: true },
    promoCode: { type: String, required: true },
    noOfProjects: { type: Number, required: true },
    dataSupport: { type: String, required: true },
    status: { type: String, enum: ['active', 'inActive'], required: true }
},
    { timestamps: true }
);
const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;