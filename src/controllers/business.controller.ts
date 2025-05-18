import { Request, Response } from 'express';
import * as businessService from '../services/business.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToS3 } from '../utils/uploadToS3';
import { generateSignedUrl } from '../utils/generateSignedUrl';

export const getBusinesses = async (req: Request, res: Response): Promise<void> => {
    const businesses = await businessService.getAllBusinesses();

    const withSignedUrls = await Promise.all(businesses.map(async (b) => {
        if (b.image_url) {
            b.signed_url = await generateSignedUrl(b.image_url);
        }
        return b;
    }));

    res.json(withSignedUrls);
};

export const getBusiness = async (req: Request, res: Response): Promise<void> => {
    const business = await businessService.getBusinessById(req.params.id);
    if (!business) {
        res.status(404).json({ message: 'Business not found' });
        return;
    }

    if (business.image_url) {
        business.signed_url = await generateSignedUrl(business.image_url);
    }

    res.json(business);
};

export const getBusinessesByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const businesses = await businessService.getBusinessesByUserId(userId);
    res.json(businesses);
};
export const getTopRated = async (req: Request, res: Response): Promise<void> => {
    const results = await businessService.getTopRatedBusinesses();
    res.json(results);
};
export const getMostBooked = async (req: Request, res: Response): Promise<void> => {
    const results = await businessService.getMostBookedBusinesses();
    res.json(results);
};

export const getNearbyBusinesses = async (req: Request, res: Response): Promise<void> => {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
        res.status(400).json({ message: 'Konum bilgisi eksik' });
        return;
    }

    const businesses = await businessService.getBusinessesNearby(parseFloat(lat as string), parseFloat(lng as string), parseFloat(radius as string));
    res.json(businesses);
};
export const searchBusinesses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { lat, lng, radius, city, town, query } = req.query;
        const homeService = req.query.homeService === 'true';
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

        const results = await businessService.searchBusinesses({
            lat: lat ? parseFloat(lat as string) : undefined,
            lng: lng ? parseFloat(lng as string) : undefined,
            radius: radius ? parseFloat(radius as string) : 10,
            city: city as string,
            town: town as string,
            query: query as string,
            homeService,
            minPrice,
            maxPrice
        });

        res.json(results);
    } catch (err) {
        console.error('searchBusinesses error:', err);
        res.status(500).json({ message: 'Search failed', error: err });
    }
};

export const createBusiness = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as AuthRequest).user.userId;
    const file = (req as AuthRequest).file;

    let image_url = null;
    if (file) {
        image_url = await uploadToS3(file, 'business/', true); // 🎯 Artık AWS'de
    }

    const businessData = {
        ...req.body,
        userId,
        image_url,
        homeService: req.body.homeService === 'true' || req.body.homeService === true
    };

    const business = await businessService.createBusiness(businessData);
    res.status(201).json(business);
};

export const updateBusiness = async (req: Request, res: Response): Promise<void> => {
    const file = (req as AuthRequest).file;
    let image_url = req.body.image_url;

    if (file) {
        image_url = await uploadToS3(file, 'business/', true);
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
