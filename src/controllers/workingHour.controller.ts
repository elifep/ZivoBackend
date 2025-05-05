import { Request, Response } from 'express';
import * as workingHourService from '../services/workingHour.service';

export const getWorkingHours = async (req: Request, res: Response): Promise<void> => {
    const hours = await workingHourService.getWorkingHours(req.params.businessId);
    res.json(hours);
};

export const createWorkingHour = async (req: Request, res: Response): Promise<void> => {
    const { businessId, weekday, open_time, close_time } = req.body;
    const created = await workingHourService.createWorkingHour(businessId, weekday, open_time, close_time);
    res.status(201).json(created);
};

export const updateWorkingHour = async (req: Request, res: Response): Promise<void> => {
    const { open_time, close_time } = req.body;
    const updated = await workingHourService.updateWorkingHour(req.params.id, open_time, close_time);
    res.json(updated);
};

export const deleteWorkingHour = async (req: Request, res: Response): Promise<void> => {
    await workingHourService.deleteWorkingHour(req.params.id);
    res.status(204).send();
};