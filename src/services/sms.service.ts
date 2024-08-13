import { AddSms, UpdateSms } from "../@types/sms.types"
import Sms from "../models/Sms";
import { CustomError } from "../middleware/errorHandler";

const getAllSms = async () => {
    try {
        return await Sms.find();

    } catch (error) {
        throw error
    }
}

const getSmsById = async (id: string) => {
    try {
        return await Sms.findById(id);
    } catch (error) {
        throw error
    }
}


const addSms = async (sms: AddSms) => {

    try {

        const { title, template } = sms;

        const existingSms = await Sms.findOne({ title: title });
        if (existingSms) {
            throw new Error('An sms with this title already exists');
        }

        const newSms = new Sms(sms);
        return await newSms.save();

    } catch (error: any) {
        throw error;
    }
}

const updateSms = async (sms: UpdateSms) => {

    try {

        const { id, template } = sms;

        const existingSms = await Sms.findById(id);
        if (!existingSms) {
            throw new CustomError("Sms does not exist", 400);
        }

        const updateSms = await Sms.findByIdAndUpdate(id, { template });

        if (!updateSms) {
            throw new CustomError("Failed to update sms", 500);
        }

        return updateSms;

    } catch (error: any) {
        throw error;
    }
}

const deleteSms = async (id: string) => {
    try {
        const existingid = await Sms.findById(id);
        if (!existingid) {
            throw new CustomError("Sms does not exists", 400)
        }

        const deleteSms = await Sms.findByIdAndDelete(id);
        return deleteSms;
    } catch (error) {
        throw error;
    }
}

export default { getAllSms, addSms, updateSms, deleteSms, getSmsById }