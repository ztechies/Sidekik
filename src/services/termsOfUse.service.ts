import { AddTermsOfUse, UpdateTermsOfUse } from "../@types/termsOfUse.types"
import TermsOfUse from "../models/TermsOfUse";
import { CustomError } from "../middleware/errorHandler";

const getAllTermsOfUses = async () => {
    try {
        return await TermsOfUse.find();

    } catch (error) {
        throw error
    }
}

const getTermsOfUseById = async (id: any) => {
    try {
        return await TermsOfUse.findById(id);
    } catch (error) {
        throw error
    }
}

const addTermsOfUse = async (termsOfUse: AddTermsOfUse) => {
    try {
        const { title, template, status } = termsOfUse;

        const existingTermsOfUse = await TermsOfUse.findOne({ title: title });
        if (existingTermsOfUse) {
            throw new Error('A TermsOfUse with this title already exists');
        }

        if (termsOfUse.status === "active") {
            // update previous active template to In-Active
            const activeToU: any = await TermsOfUse.findOne({ status: 'active' });

            if (activeToU) {
                activeToU.status = 'inActive';
                const activeId = activeToU.id;
                delete activeToU.id;
                await TermsOfUse.findByIdAndUpdate(activeId, { ...activeToU });
            }
        }
        const newTermsOfUse = new TermsOfUse(termsOfUse);
        const savedTermsOfUse = await newTermsOfUse.save();

        return savedTermsOfUse;

    } catch (error: any) {
        throw error;
    }
}

const updateTermsOfUse = async (termsOfUse: UpdateTermsOfUse) => {

    try {

        const id = termsOfUse.id
        const dataToBeUpdate: any = termsOfUse

        const existingTermsOfUse = await TermsOfUse.findById(id);
        if (!existingTermsOfUse) {
            throw new CustomError("TermsOfUse does not exist", 404);
        }

        if (dataToBeUpdate.status) {
            const activeToU: any = await TermsOfUse.findOne({ status: 'active' });

            if (activeToU) {

                activeToU.status = 'inActive';
                const activeId = activeToU.id;
                delete activeToU.id;
                await TermsOfUse.findByIdAndUpdate(activeId, { ...activeToU });
            }

            delete dataToBeUpdate.id;
            const updateStatusTermsOfUse = await TermsOfUse.findByIdAndUpdate(id, { ...dataToBeUpdate });

            return updateStatusTermsOfUse
        }

        const updateTermsOfUse = await TermsOfUse.findByIdAndUpdate(id, { ...dataToBeUpdate });

        if (!updateTermsOfUse) {
            throw new CustomError("Failed to update TermsOfUse", 500);
        }

        return updateTermsOfUse;

    } catch (error: any) {
        throw error;
    }
}

const deleteTermsOfUse = async (id: string) => {
    try {

        const existingTermsOfUse = await TermsOfUse.findById(id);
        if (!existingTermsOfUse) {
            throw new CustomError("TermsOfUse does not exists", 404)
        }

        if(existingTermsOfUse.status === "active"){
            throw new CustomError("Active ToU only deleted after Activating another template.", 401);
        }
        const deleteTermsOfUse = await TermsOfUse.findByIdAndDelete(id);
        return deleteTermsOfUse;
    } catch (error) {
        throw error;
    }
}

export default { getAllTermsOfUses, getTermsOfUseById, addTermsOfUse, updateTermsOfUse, deleteTermsOfUse }