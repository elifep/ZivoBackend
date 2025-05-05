import { Request, Response } from 'express';
import * as businessService from '../services/business.service';

export const getBusinesses = async (req: Request, res: Response): Promise<void> => {
    const businesses = await businessService.getAllBusinesses();
    res.json(businesses);
};

export const getBusiness = async (req: Request, res: Response): Promise<void> => {
    const business = await businessService.getBusinessById(req.params.id);
    if (!business) {
        res.status(404).json({ message: 'Business not found' });
        return;
    }
    res.json(business);
};

export const getBusinessesByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const businesses = await businessService.getBusinessesByUserId(userId);
    res.json(businesses);
};

export const createBusiness = async (req: Request, res: Response): Promise<void> => {
    const business = await businessService.createBusiness(req.body);
    res.status(201).json(business);
};

export const updateBusiness = async (req: Request, res: Response): Promise<void> => {
    const updated = await businessService.updateBusiness(req.params.id, req.body);
    if (!updated) {
        res.status(404).json({ message: 'Business not found' });
        return;
    }
    res.json(updated);
};

export const deleteBusiness = async (req: Request, res: Response): Promise<void> => {
    await businessService.deleteBusiness(req.params.id);
    res.status(204).send();
};
