// src/controllers/profile.controller.ts
import { Request, Response } from 'express';
import * as profileService from '../services/profile.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProfiles = async (req: Request, res: Response): Promise<void> => {
    const profiles = await profileService.getAllProfiles();
    res.json(profiles);
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const profile = await profileService.getProfileById(req.params.id);
    if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    res.json(profile);
};

export const getProfileByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const profile = await profileService.getProfileByUserId(userId);

    if (!profile) {
        res.status(404).json({ message: 'Profile not found for this user' });
        return;
    }

    res.json(profile);
};
export const getOwnProfile = async (req: Request, res: Response): Promise<void> => {
    const { userId } = (req as AuthRequest).user;
    const profile = await profileService.getProfileByUserId(userId);
    res.json(profile);
};

export const createProfile = async (req: Request, res: Response): Promise<void> => {
    const profile = await profileService.createProfile(req.body);
    res.status(201).json(profile);
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const updated = await profileService.updateProfile(req.params.id, req.body);
    res.json(updated);
};
export const updateProfileByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const updated = await profileService.updateProfileByUserId(userId, req.body);

    if (!updated) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }

    res.json(updated);
};
// controllers/profile.controller.ts
export const updateOwnProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as AuthRequest).user.userId;
    const image = (req as AuthRequest).file;

    let image_url = null;
    if (image) {
        image_url = `uploads/${image.originalname}`; // AWS ile entegre edeceğiz sonra
    }

    const updated = await profileService.updateProfileByUserId(userId, {
        ...req.body,
        image_url,
    });

    res.json(updated);
};
export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
    await profileService.deleteProfile(req.params.id);
    res.status(204).send();
};
export const deleteProfileByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    await profileService.deleteProfileByUserId(userId);
    res.status(204).send();
};  