import UserPortfolio from "../models/UserPortfolio";
import { CustomError } from "../middleware/errorHandler";
import { UpdateUserPortfolio, AddUserPortfolio } from '../@types/userPortfilio.types'
import Profile from "../models/Profile";
import mongoose from "mongoose";

// Get all user portfolios
const getAllUserPortfolios = async () => {
    try {
        const allPortfolios = await UserPortfolio.find();

        if (!allPortfolios) {
            throw new CustomError("No portfolios in Database", 400)
        }
        return allPortfolios
    } catch (error) {
        throw error;
    }
};

// Get a user portfolio by ID
const getUserPortfolioById = async (id: any) => {
    try {
        const userPortfolio = await UserPortfolio.findById(id);
        if (!userPortfolio) {
            throw new CustomError("User Portfolio Not found with given ID", 400)
        }
        return userPortfolio
    } catch (error) {
        throw error;
    }
};

const getPortfolioByProfileId = async (profileId: string) => {
    try {
        let userPortfolio = await UserPortfolio.findOne({ profileId });
        if (!userPortfolio) {
            userPortfolio = new UserPortfolio({ profileId })
            await userPortfolio.save()
        }
        return userPortfolio
    } catch (error) {
        throw error;
    }
};

// Add a user portfolio
const addUserPortfolio = async (portfolio: AddUserPortfolio) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            profileId,
            materialType,
            materialTypeName,
            customMaterialType,
            files,
            links
        } = portfolio;

        // Check if the profile exists
        const userProfile = await Profile.findById(profileId).session(session);
        if (!userProfile) {
            throw new CustomError("User Profile Not found.", 400);
        }


        const userPortfolio = await UserPortfolio.findOne({ profileId });
        if (userPortfolio) {
            throw new CustomError("Portfolio already exist on this Profile Id.", 400);
        }

        if (materialType != 'Other' && customMaterialType) {
            throw new CustomError("You cannot add custom material type if you have not add other as material type ", 400);
        }

        const newPortfolio = new UserPortfolio(portfolio);
        const savedPortfolio = await newPortfolio.save({ session });

        await session.commitTransaction();
        session.endSession();
        return savedPortfolio;
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


const updateUserPortfolio = async (portfolio: UpdateUserPortfolio, profileId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const existingPortfolio = await UserPortfolio.findOne({ profileId }).session(session);
        if (!existingPortfolio) {
            throw new CustomError("User portfolio does not exist", 400);
        }

        const existingProfile = await Profile.findById(profileId).session(session);
        if (!existingProfile) {
            throw new CustomError("User profile does not exist", 400);
        }

        const updatedPortfolio = await UserPortfolio.updateOne({ profileId }, { ...portfolio });

        if (!updatedPortfolio) {
            throw new CustomError("Failed to update user portfolio", 500);
        }

        await session.commitTransaction();
        session.endSession();

        return "Portfolio Updated Successfully";
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// Delete a user portfolio
const deleteUserPortfolio = async (id: string) => {
    try {
        const existingPortfolio = await UserPortfolio.findById(id);
        if (!existingPortfolio) {
            throw new CustomError("User portfolio does not exist", 400);
        }

        const deletedPortfolio = await UserPortfolio.findByIdAndDelete(id);
        return deletedPortfolio;
    } catch (error) {
        throw error;
    }
};

export default { getAllUserPortfolios, getUserPortfolioById, getPortfolioByProfileId, addUserPortfolio, updateUserPortfolio, deleteUserPortfolio };