import mongoose from "mongoose";

const userPortfolioSchema = new mongoose.Schema(
    {
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'Profile'
        },
        materialType: {
            type: String,
            enum: ['Website', 'Video', 'Image', 'Press Release', 'Other'],
        },
        materialTypeName: {
            type: String
        },

        customMaterialType: {
            type: String
        },

        files: {
            type: [String],
            default: undefined
        },

        links: {
            type: [String],
            default: undefined
        },
    },

    { timestamps: true }
);

const UserPortfolio = mongoose.model("UserPortfolio", userPortfolioSchema);

export default UserPortfolio;