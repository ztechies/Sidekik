import { AddUserLicense, UpdateUserLicense } from "../@types/userLicense.types"
import UserLicense from "../models/UserLicense";
import { CustomError } from "../middleware/errorHandler";

const getAllUserLicenses = async () => {
    try {
        return await UserLicense.find();
    } catch (error) {
        throw error
    }
}

const getUserLicenseById = async (id: any) => {
    try {
        return await UserLicense.findById(id);
    } catch (error) {
        throw error
    }
}

const addUserLicense = async (userLicense: AddUserLicense) => {
    try {
        const { title, template, status } = userLicense;

        const existingUserLicense = await UserLicense.findOne({ title: title });
        if (existingUserLicense) {
            throw new Error('A User License with this title already exists');
        }
        if (userLicense.status === "active") {

            // update previous active template to In-Active
            const activeUserLicense: any = await UserLicense.findOne({ status: 'active' });

            if (activeUserLicense) {
                activeUserLicense.status = 'inActive';
                const activeId = activeUserLicense.id;
                delete activeUserLicense.id;
                await UserLicense.findByIdAndUpdate(activeId, { ...activeUserLicense });
            }
        }

        const newPolicy = new UserLicense(userLicense);
        const savedPolicy = await newPolicy.save();

        return savedPolicy;
    } catch (error: any) {
        throw error;
    }
}

const updateUserLicense = async (userLicense: UpdateUserLicense) => {
    try {
        const id = userLicense.id
        const dataToBeUpdate: any = userLicense

        delete dataToBeUpdate.id;

        const existingUserLicense = await UserLicense.findById(id);
        if (!existingUserLicense) {
            throw new CustomError("User License does not exist", 400);
        }
        if (dataToBeUpdate.status) {
            const activeUserLicense: any = await UserLicense.findOne({ status: 'active' });


            if (activeUserLicense) {

                activeUserLicense.status = 'inActive';
                const activeId = activeUserLicense.id;
                delete activeUserLicense.id;
                await UserLicense.findByIdAndUpdate(activeId, { ...activeUserLicense });
            }

            delete dataToBeUpdate.id;
            const updateStatusPolicy = await UserLicense.findByIdAndUpdate(id, { ...dataToBeUpdate });

            return updateStatusPolicy
        }
        const updateUserLicense = await UserLicense.findByIdAndUpdate(id, { ...dataToBeUpdate });

        if (!updateUserLicense) {
            throw new CustomError("Failed to update User License", 500);
        }
        return updateUserLicense;
    } catch (error: any) {
        throw error;
    }
}

const deleteUserLicense = async (id: string) => {
    try {

        const existingUserLicense = await UserLicense.findById(id);
        if (!existingUserLicense) {
            throw new CustomError("User License does not exists", 400)
        }
        if (existingUserLicense.status === "active") {
            throw new CustomError("Active User License only deleted after Activating another Policy Template.", 401);
        }

        const deleteUserLicense = await UserLicense.findByIdAndDelete(id);
        return deleteUserLicense;
    } catch (error) {
        throw error;
    }
}

export default { getAllUserLicenses, getUserLicenseById, addUserLicense, updateUserLicense, deleteUserLicense }