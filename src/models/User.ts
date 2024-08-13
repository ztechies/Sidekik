import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [/\S+@\S+\.\S+/, "is invalid"]
        },
        mobile: { type: String },
        password: { type: String },
        role: {
            type: String,
            enum: ["client", "admin", "user"],
            required: true
        },
        googleId: { type: String },
        registrationType: {
            type: String,
            enum: ["form", "google"],
            required: true
        },
        status: { type: String, enum: ["active", "inActive"] },
        lastLogin: { type: Number },
        userName: { type: String, required: true, unique: true },
        emailVerify: { type: Boolean, default: false },
        profileImage: { type: String },
        security: {
            ToU: { type: String },
            privacyPolicy: { type: String },
            userLicense: { type: String },
            ipAddress: { type: String },
            dateAndTime: { type: String }
        },
        timezone: { type: String }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;