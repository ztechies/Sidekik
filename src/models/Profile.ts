import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    id: { type: Number, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true }
}, { _id: false });

const stateSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true }
}, { _id: false });

const citySchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }
}, { _id: false });

const socialLinkSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: [true, 'Platform is required'],
        enum: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Other'],
        default: undefined
    },
    url: {
        type: String,
        required: [true, 'URL is required'],
        match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL'],
        default: undefined
    },
});

const profileSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
        primaryService: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', unique: true }],
            default: undefined
        },
        otherService: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', unique: true, default: undefined }],
            default: undefined
        },
        country: { type: countrySchema, default: undefined },
        state: { type: stateSchema, default: undefined },
        city: { type: citySchema, default: undefined },
        languages: {
            type: [{ type: String }],
            default: undefined
        },
        usePlatformAs: { type: String, enum: ['business', 'individual'] },
        business: {
            businessName: { type: String },
            countryOfIncorporation: { type: String },
            registrationNumber: { type: String },
            address: { type: String }
        },
        socialLinks: {
            type: [socialLinkSchema],
            default: undefined
        },
        shortIntro: { type: String },
        longIntro: { type: String },
        clientCountries: {
            type: [{ type: String }],
            default: undefined
        },
    },
    { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;