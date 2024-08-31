import { AddPackage, UpdatePackage } from "../@types/package.types"
import Package from "../models/Packages";
import User from "../models/User";
import Service from "../models/Service";
import { CustomError } from "../middleware/errorHandler";

const getAllPackage = async () => {
    try {
        return await Package.find();

    } catch (error) {
        throw error
    }
}

const getPackageById = async (id: string) => {
    try {
        return await Package.findById(id);
    } catch (error) {
        throw error
    }
}

const getPackageByUserId = async (userId: string) => {
    try {
        console.log("userId", userId);

        return await Package.find({ userId });
    } catch (error) {
        throw error
    }
}

const addPackage = async (packages: AddPackage) => {

    try {
        const { title, userId, serviceId } = packages;

        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            throw new Error('User does not exist for the given User Id');
        }

        const existingService = await Service.findOne({ _id: serviceId });
        if (!existingService) {
            throw new Error('Service does not exist for the given Service Id');
        }

        const existingPackage = await Package.findOne({ title: title, userId: userId });
        if (existingPackage) {
            throw new Error('An Package with this title already exists');
        }

        const newPackage = new Package(packages);
        return await newPackage.save();

    } catch (error: any) {
        throw error;
    }
}

const updatePackage = async (id: string, packages: UpdatePackage) => {

    try {

        const existingPackage = await Package.findById(id);
        if (!existingPackage) {
            throw new CustomError("Package does not exist", 400);
        }

        const updatePackage = await Package.findByIdAndUpdate(id, packages, { new: true });

        if (!updatePackage) {
            throw new CustomError("Failed to update Package", 500);
        }

        return updatePackage;

    } catch (error: any) {
        throw error;
    }
}

const deletePackage = async (id: string) => {
    try {
        const existingPackage = await Package.findById(id);
        if (!existingPackage) {
            throw new CustomError("Package does not exist", 400);
        }

        // Use the soft delete method provided by mongoose-delete
        await existingPackage.delete();

        return existingPackage;
    } catch (error) {
        throw error;
    }
};


export default { getAllPackage, addPackage, updatePackage, deletePackage, getPackageById, getPackageByUserId }