import { AddEmail, UpdateEmail } from "../@types/email.types"
import Email from "../models/Email";
import { CustomError } from "../middleware/errorHandler";

const getAllEmails = async () => {
    try {
        return await Email.find();

    } catch (error) {
        throw error
    }
}

const getEmailById = async (id: string) => {
    try {
        return await Email.findById(id);
    } catch (error) {
        throw error
    }
}

const addEmail = async (email: AddEmail) => {
    try {
        const { title, template } = email;

        const existingEmail = await Email.findOne({ title: title });
        if (existingEmail) {
            throw new Error('An email with this title already exists');
        }

        const newEmail = new Email(email);
        const savedEmail = await newEmail.save();

        return savedEmail;

    } catch (error: any) {
        throw error;
    }
}

const updateEmail = async (email: UpdateEmail) => {

    try {

        const { id, template } = email;

        const existingEmail = await Email.findById(id);
        if (!existingEmail) {
            throw new CustomError("Email does not exist", 400);
        }

        const updateEmail = await Email.findByIdAndUpdate(id, { template });

        if (!updateEmail) {
            throw new CustomError("Failed to update email", 500);
        }

        return updateEmail;

    } catch (error: any) {
        throw error;
    }
}

const deleteEmail = async (id: string) => {
    try {

        const existingid = await Email.findById(id);
        if (!existingid) {
            throw new CustomError("Email does not exists", 400)
        }

        const deleteEmail = await Email.findByIdAndDelete(id);
        return deleteEmail;
    } catch (error) {
        throw error;
    }
}

export default { getAllEmails, getEmailById, addEmail, updateEmail, deleteEmail }