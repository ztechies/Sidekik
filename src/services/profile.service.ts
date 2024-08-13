import Profile from "../models/Profile";
import { CustomError } from "../middleware/errorHandler";
import { AddProfileSchema, UpdateProfileSchema } from "../@types/profile.types";
import User from "../models/User";
import mongoose from "mongoose";

interface User {
    _id: string;
    profileImage?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
}

const getAllProfiles = async () => {
    try {
        return await Profile.find().populate([{ path: 'userId', model: 'User' }, { path: 'primaryService', model: 'Service' }, { path: 'otherService', model: 'Service' }]);
    } catch (error) {
        throw error;
    }
}

const getProfileById = async (id: string) => {
    try {
        return await Profile.findById(id).populate([{ path: 'userId', model: 'User' }, { path: 'primaryService', model: 'Service' }, { path: 'otherService', model: 'Service' }]);
    } catch (error) {
        throw error;
    }
}

const getProfileByUserId = async (userId: string) => {
    try {
        let profile = await Profile.findOne({ userId });
        if (!profile) {
            profile = new Profile({ userId });
            await profile.save();
        }
        return profile;
    } catch (error) {
        throw error;
    }
}

const addProfile = async (profile: AddProfileSchema) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            userId,
            profileImage,
            firstName,
            lastName,
            mobile
        } = profile;

        const profileDataToBeAdded: any = { ...profile };
        delete profileDataToBeAdded.profileImage;
        delete profileDataToBeAdded.firstName;
        delete profileDataToBeAdded.lastName;
        delete profileDataToBeAdded.mobile;

        const userDataToBeAdded: any = {
            profileImage,
            firstName,
            lastName,
            mobile
        };

        const updateUser = await User.findByIdAndUpdate(userId, userDataToBeAdded, { new: true, session });

        const newProfile = new Profile(profileDataToBeAdded);

        const savedProfile = await newProfile.save({ session });

        if (updateUser && savedProfile) {
            await session.commitTransaction();
            session.endSession();
            return ("Profile Added Successfully");
        } else {
            throw new Error('User update or profile save failed');
        }
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const updateProfile = async (profile: UpdateProfileSchema) => {
    try {

        const { userId } = profile;

        const existingProfile = await Profile.findOne({ userId });
        if (!existingProfile) {
            throw new CustomError("Profile does not exist", 400);
        }
        const updatedProfile = await Profile.updateOne({ userId }, profile);

        if (updatedProfile) {
            return 'Profile Updated Successfully';
        }
    } catch (error: any) {
        throw new Error(error);
    }
};


const deleteProfile = async (id: string) => {
    try {
        const existingProfile = await Profile.findById(id);
        if (!existingProfile) {
            throw new CustomError("Profile does not exist", 400);
        }
        // Should be deleted 
        const deletedProfile = await Profile.findByIdAndDelete(id);
        if (deletedProfile) {
            return "Profile deleted Successfully";
        }
    } catch (error) {
        throw error;
    }
}

export default { getAllProfiles, getProfileById, addProfile, updateProfile, deleteProfile, getProfileByUserId };
