import { Request, Response } from 'express';
import * as businessService from '../services/business.service';
import { AuthRequest } from '../middleware/auth.middleware';
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
    const userId = (req as AuthRequest).user.userId;
    const file = (req as AuthRequest).file;

    let image_url = null;
    if (file) {
        // Şimdilik local path gibi veriyoruz, ileride AWS'ye upload edeceğiz
        image_url = `uploads/${file.originalname}`;
    }

    const businessData = {
        ...req.body,
        userId,
        image_url,
    };

    const business = await businessService.createBusiness(businessData);
    res.status(201).json(business);
};
export const updateBusiness = async (req: Request, res: Response): Promise<void> => {
    const file = (req as AuthRequest).file;

    let image_url = req.body.image_url || null; // eski değer tutulabilir
    if (file) {
        image_url = `uploads/${file.originalname}`; // ileride AWS olacak
    }

    const updated = await businessService.updateBusiness(req.params.id, {
        ...req.body,
        image_url,
    });

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
