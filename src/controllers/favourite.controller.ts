import { Request, Response } from 'express';
import * as favouriteService from '../services/favourite.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMyFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
    const favourites = await favouriteService.getFavouritesByUserId(req.user.userId);
    res.json(favourites);
};

export const addToFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
    const { businessId } = req.body;
    const fav = await favouriteService.addFavourite(req.user.userId, businessId);
    res.status(201).json(fav);
};

export const removeFromFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
    const businessId = req.params.businessId;
    await favouriteService.removeFavourite(req.user.userId, businessId);
    res.status(204).send();
};