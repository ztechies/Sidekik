import { AddPolicy, UpdatePolicy } from "../@types/policy.types"
import Policy from "../models/Policy";
import { CustomError } from "../middleware/errorHandler";

const getAllPolicies = async () => {
    try {
        return await Policy.find();

    } catch (error) {
        throw error
    }
}

const getPolicyById = async (id: any) => {
    try {
        return await Policy.findById(id);
    } catch (error) {
        throw error
    }
}

const addPolicy = async (policy: AddPolicy) => {
    try {
        const { title, template, status } = policy;

        const existingPolicy = await Policy.findOne({ title: title });
        if (existingPolicy) {
            throw new Error('A Policy with this title already exists');
        }

        if (policy.status === "active") {
            // update previous active template to In-Active
            const activeToU: any = await Policy.findOne({ status: 'active' });

            if (activeToU) {
                activeToU.status = 'inActive';
                const activeId = activeToU.id;
                delete activeToU.id;
                await Policy.findByIdAndUpdate(activeId, { ...activeToU });
            }
        }
        const newPolicy = new Policy(policy);
        const savedPolicy = await newPolicy.save();

        return savedPolicy;

    } catch (error: any) {
        throw error;
    }
}

const updatePolicy = async (policy: UpdatePolicy) => {

    try {

        const id = policy.id
        const dataToBeUpdate: any = policy

        delete dataToBeUpdate.id;

        const existingPolicy = await Policy.findById(id);
        if (!existingPolicy) {
            throw new CustomError("Policy does not exist", 400);
        }

        if (dataToBeUpdate.status) {
            const activePolicy: any = await Policy.findOne({ status: 'active' });

            if (activePolicy) {

                activePolicy.status = 'inActive';
                const activeId = activePolicy.id;
                delete activePolicy.id;
                await Policy.findByIdAndUpdate(activeId, { ...activePolicy });
            }

            delete dataToBeUpdate.id;
            const updateStatusPolicy = await Policy.findByIdAndUpdate(id, { ...dataToBeUpdate });
            return updateStatusPolicy
        }

        const updatePolicy = await Policy.findByIdAndUpdate(id, { ...dataToBeUpdate });

        if (!updatePolicy) {
            throw new CustomError("Failed to update Policy", 500);
        }

        return updatePolicy;

    } catch (error: any) {
        throw error;
    }
}

const deletePolicy = async (id: string) => {
    try {

        const existingPolicy = await Policy.findById(id);
        if (!existingPolicy) {
            throw new CustomError("Policy does not exists", 400)
        }
        if (existingPolicy.status === "active") {
            throw new CustomError("Active Policy only deleted after Activating another Policy Template.", 401);
        } 
        const deletePolicy = await Policy.findByIdAndDelete(id);
        return deletePolicy;
    } catch (error) {
        throw error;
    }
}

export default { getAllPolicies, getPolicyById, addPolicy, updatePolicy, deletePolicy }