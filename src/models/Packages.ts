// import mongoose, { Schema } from "mongoose";
import mongoose, { Schema } from 'mongoose';
import MongooseDelete, { SoftDeleteDocument } from 'mongoose-delete';

interface IPackage extends Document, SoftDeleteDocument {
    serviceId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    title: string;
    subTitle: string;
    packageType: 'standard' | 'custom';
    price: number;
    duration: string;
    inclusions: string;
    isPopular: boolean;
    milestones: typeof milestoneSchema[];
}

const milestoneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    percentage: { type: Number, required: true },
    when: {
        type: String,
        // required: true
    },
    // dueDate: { type: Date, required: true },
    completed: {
        type: Boolean,
        // default: false 
    },
    isDeleted: { type: Boolean, default: false }
}, { _id: false });

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
    milestones: { type: [milestoneSchema] }
},
    { timestamps: true }
);
packagesSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
const Packages = mongoose.model<IPackage>('Packages', packagesSchema);
export default Packages;