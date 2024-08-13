import mongoose from "mongoose";

const userLicenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    template: { type: String, required: true },
    status: {type: String, enum: ['active', 'inActive'], required: true}
},
    { timestamps: true }
);
const UserLicense = mongoose.model('UserLicense', userLicenseSchema);
export default UserLicense;