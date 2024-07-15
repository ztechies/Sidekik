import { AddSubscription, UpdateSubscription } from "../@types/subscription.types"
import Subscription from "../models/Subscription";
import { CustomError } from "../middleware/errorHandler";

const getAllSubscription = async () => {
    try {
        return await Subscription.find();

    } catch (error) {
        throw error
    }
}

const getSubscriptionById = async (id: string) => {
    try {
        return await Subscription.findById(id);
    } catch (error) {
        throw error
    }
}

const addSubscription = async (subscription: AddSubscription) => {
    try {
        const { title } = subscription;

        const existingSubscription = await Subscription.findOne({ title: title });
        if (existingSubscription) {
            throw new Error('An subscription with this title already exists');
        }

        const newSubscription = new Subscription(subscription);
        const savedSubscription = await newSubscription.save();

        return savedSubscription;

    } catch (error: any) {
        throw error;
    }
}

const updateSubscription = async (subscription: UpdateSubscription) => {

    try {

        const { id, ...data } = subscription;

        const existingSubscription = await Subscription.findById(id);
        if (!existingSubscription) {
            throw new CustomError("Subscription does not exist", 400);
        }

        const updateSubscription = await Subscription.findByIdAndUpdate(id, { ...data });

        if (!updateSubscription) {
            throw new CustomError("Failed to update subscription", 500);
        }

        return updateSubscription;

    } catch (error: any) {
        throw error;
    }
}

const deleteSubscription = async (id: string) => {
    try {

        const existingid = await Subscription.findById(id);

        if (!existingid) {
            throw new CustomError("Subscription does not exists", 400)
        }

        const deleteSubscription = await Subscription.findByIdAndDelete(id);
        return deleteSubscription;
    } catch (error) {
        throw error;
    }
}

export default { getAllSubscription, getSubscriptionById, addSubscription, updateSubscription, deleteSubscription }