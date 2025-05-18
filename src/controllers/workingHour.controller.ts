
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as workingHourService from '../services/workingHour.service';

const toCamelCase = (row: any) => ({
    businessId: row.businessid,
    weekday: row.weekday,
    openTime: row.openTime,
    closeTime: row.closeTime,
    isOpen: !!(row.open_time && row.close_time),
});

export const getWorkingHours = async (req: AuthRequest, res: Response): Promise<void> => {
    const rows = await workingHourService.getWorkingHours(req.params.businessId);
    const result = rows.map(toCamelCase);
    res.json(result);
};

export const createWorkingHour = async (req: AuthRequest, res: Response): Promise<void> => {
    const { businessid, weekday, openTime, closeTime } = req.body;

    const isOwned = await workingHourService.isBusinessOwnedByUser(businessid, req.user.userId);
    if (!isOwned) {
        res.status(403).json({ message: 'Bu işletmeye ait saat bilgisi ekleme yetkiniz yok.' });
        return;
    }

    const created = await workingHourService.createWorkingHour(businessid, weekday, openTime, closeTime);
    res.status(201).json(toCamelCase(created));
};

export const updateWorkingHour = async (req: AuthRequest, res: Response): Promise<void> => {
    const { openTime, closeTime } = req.body;

    const existing = await workingHourService.getWorkingHourById(req.params.id);
    if (!existing) {
        res.status(404).json({ message: 'Kayıt bulunamadı.' });
        return;
    }

    const isOwned = await workingHourService.isBusinessOwnedByUser(existing.businessid, req.user.userId);
    if (!isOwned) {
        res.status(403).json({ message: 'Bu işletmeye ait çalışma saatini güncelleme yetkiniz yok.' });
        return;
    }

    const updated = await workingHourService.updateWorkingHour(req.params.id, openTime, closeTime);
    res.json(toCamelCase(updated));
};

export const deleteWorkingHour = async (req: AuthRequest, res: Response): Promise<void> => {
    const existing = await workingHourService.getWorkingHourById(req.params.id);
    if (!existing) {
        res.status(404).json({ message: 'Kayıt bulunamadı.' });
        return;
    }

    const isOwned = await workingHourService.isBusinessOwnedByUser(existing.businessid, req.user.userId);
    if (!isOwned) {
        res.status(403).json({ message: 'Bu işletmeye ait çalışma saatini silme yetkiniz yok.' });
        return;
    }

    await workingHourService.deleteWorkingHour(req.params.id);
    res.status(204).send();
};