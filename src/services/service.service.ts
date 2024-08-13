import { AddService, UpdateService } from "../@types/service.types"
import Service from "../models/Service";
import { CustomError } from "../middleware/errorHandler";

const getAllService = async (role: string) => {
    try {
        let query: any = { isDeleted : false };
        if (role !== 'admin') query.isVerified = true
        return await Service.find(query).select('title isVerified');
    } catch (error) {
        throw error
    }
}

const getServiceById = async (id: string) => {
    try {
        return await Service.findById(id);
    } catch (error) {
        throw error
    }
}


const addService = async (service: AddService) => {

    try {

        const { title } = service;

        const existingService = await Service.findOne({ title: title });
        if (existingService) {
            throw new Error('An Service with this title already exists');
        }

        const newService = new Service(service);
        return await newService.save();

    } catch (error: any) {
        throw error;
    }
}

const updateService = async (service: UpdateService) => {

    try {

        const { id, title, isVerified, isDeleted } = service;
        const existingService = await Service.findById(id);
        if (!existingService) {
            throw new CustomError("Service does not exist", 400);
        }

        const updateService = await Service.findByIdAndUpdate(id, { title, isVerified, isDeleted },{ new: true }).select('title isVerified');

        if (!updateService) {
            throw new CustomError("Failed to update Service", 500);
        }

        return updateService;

    } catch (error: any) {
        throw error;
    }
}

const deleteService = async (id: string) => {
    try {
        const existingid = await Service.findById(id);
        if (!existingid) {
            throw new CustomError("Service does not exists", 400)
        }

        const deleteService = await Service.findByIdAndUpdate(id, { isDeleted: true },{ new: true });
        return deleteService;
    } catch (error) {
        throw error;
    }
}

export default { getAllService, addService, updateService, deleteService, getServiceById }