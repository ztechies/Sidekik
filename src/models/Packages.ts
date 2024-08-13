import mongoose, { Schema } from "mongoose";

const milestoneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    percentage: { type: Number, required: true },
    when: { type: String, 
        // required: true
     },
    // dueDate: { type: Date, required: true },
    completed: { type: Boolean, 
        // default: false 
    },
    isDeleted: { type: Boolean, default: false }
});

const packagesSchema = new mongoose.Schema({
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    packageType: { type: String, required: true, enum: ["standard", "custom"] },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    inclusions: { type: String, required: true },
    isPopular: { type: Boolean, required: true },
    milestones: {type: [milestoneSchema]}
},
    { timestamps: true }
);
const Packages = mongoose.model('Packages', packagesSchema);
export default Packages;