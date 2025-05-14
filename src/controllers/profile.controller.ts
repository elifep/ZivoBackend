// src/controllers/profile.controller.ts
import { Request, Response } from 'express';
import * as profileService from '../services/profile.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToS3 } from '../utils/uploadToS3'; // zaten var diye varsayıyorum
import { generateSignedUrl } from '../utils/generateSignedUrl';

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

    if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    // ✅ signed URL üret
    if (profile.image_url) {
        profile.signed_url = await generateSignedUrl(profile.image_url);
    }

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
    const file = (req as AuthRequest).file;

    // Önce mevcut profil bilgilerini alalım
    const existingProfile = await profileService.getProfileByUserId(userId);
    if (!existingProfile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }

    let image_url = existingProfile.image_url;

    if (file) {
        image_url = await uploadToS3(file, 'profile/', false);
    }

    const updateData: any = {};
    for (const key of ['full_name', 'phone', 'birthday', 'gender', 'address']) {
        if (req.body[key] !== undefined && req.body[key] !== '') {
            updateData[key] = req.body[key];
        }
    }

    updateData.image_url = image_url; // ✨ Yeni olmasa bile eskiyi ekliyoruz

    const updated = await profileService.updateProfileByUserId(userId, updateData);

    if (updated.image_url) {
        updated.signed_url = await generateSignedUrl(updated.image_url);
    }

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