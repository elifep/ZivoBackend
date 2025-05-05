import { Request, Response } from 'express';
import * as socialMediaService from '../services/socialMedia.service';

// Tüm sosyal medya kayıtlarını getir
export const getAllSocialMedia = async (req: Request, res: Response): Promise<void> => {
    const socialMedia = await socialMediaService.getAllSocialMedia();
    res.json(socialMedia);
};

// Belirli bir ID'ye sahip sosyal medya kaydını getir
export const getSocialMediaById = async (req: Request, res: Response): Promise<void> => {
    const socialMedia = await socialMediaService.getSocialMediaById(req.params.id);
    if (!socialMedia) {
        res.status(404).json({ message: 'Social media record not found' });
        return;
    }
    res.json(socialMedia);
};

// Belirli bir işletmeye ait sosyal medya hesaplarını getir
export const getSocialMediaByBusinessId = async (req: Request, res: Response): Promise<void> => {
    const businessId = req.params.businessId;
    const socialMedia = await socialMediaService.getSocialMediaByBusinessId(businessId);
    res.json(socialMedia);
};

// Yeni bir sosyal medya kaydı oluştur
export const createSocialMedia = async (req: Request, res: Response): Promise<void> => {
    const socialMedia = await socialMediaService.createSocialMedia(req.body);
    res.status(201).json(socialMedia);
};

// Sosyal medya kaydını güncelle
export const updateSocialMedia = async (req: Request, res: Response): Promise<void> => {
    const updated = await socialMediaService.updateSocialMedia(req.params.id, req.body);
    if (!updated) {
        res.status(404).json({ message: 'Social media record not found' });
        return;
    }
    res.json(updated);
};

// Sosyal medya kaydını sil
export const deleteSocialMedia = async (req: Request, res: Response): Promise<void> => {
    await socialMediaService.deleteSocialMedia(req.params.id);
    res.status(204).send();
};
