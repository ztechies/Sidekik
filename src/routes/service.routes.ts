import express, { Router } from 'express';
import { addService, updateService, getService, deleteService, getServiceById } from '../controllers/service.controller';
import { validate } from '../middleware/validator';
import { addServiceSchema, updateServiceSchema } from '../validation/service';
import { verifyToken } from '../middleware/verifyToken';

const ServiceRouter: Router = express.Router();

// ServiceRouter.get('/', verifyToken, getSms)
// ServiceRouter.get('/:id', verifyToken, getSmsById)
// ServiceRouter.post('/', verifyToken, validate(addSmsSchema), addSms)
// ServiceRouter.patch('/', verifyToken, validate(updateSmsSchema), updateSms)
// ServiceRouter.delete('/:id', verifyToken, deleteSms)

ServiceRouter.get('/', verifyToken, getService)
ServiceRouter.get('/:id', getServiceById)
ServiceRouter.post('/', validate(addServiceSchema), addService)
ServiceRouter.patch('/', verifyToken, validate(updateServiceSchema), updateService)
ServiceRouter.delete('/:id', verifyToken, deleteService)

export default ServiceRouter;