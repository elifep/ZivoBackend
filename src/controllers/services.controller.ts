import { Request, Response } from 'express';
import * as serviceService from '../services/services.service';

export const getServices = async (req: Request, res: Response): Promise<void> => {
    const services = await serviceService.getAllServices();
    res.json(services);
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) {
        res.status(404).json({ message: 'Service not found' });
        return;
    }
    res.json(service);
};

export const getServicesByBusinessId = async (req: Request, res: Response): Promise<void> => {
    const businessId = req.params.businessId;
    const services = await serviceService.getServicesByBusinessId(businessId);
    res.json(services);
};

export const createService = async (req: Request, res: Response): Promise<void> => {
    const service = await serviceService.createService(req.body);
    res.status(201).json(service);
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
    const service = req.body;
    const id = req.params.id;

    // Zorunlu alan kontrolü
    const requiredFields = ['businessId', 'name', 'price', 'duration_min'];
    const missingFields = requiredFields.filter(field => service[field] === undefined || service[field] === null);

    if (missingFields.length > 0) {
        res.status(400).json({ message: `Eksik alanlar: ${missingFields.join(', ')}` });
        return;
    }

    try {
        const updated = await serviceService.updateService(id, service);
        if (!updated) {
            res.status(404).json({ message: 'Service not found' });
            return;
        }
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Hizmet güncellenirken bir hata oluştu' });
    }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
    await serviceService.deleteService(req.params.id);
    res.status(204).send();
};
