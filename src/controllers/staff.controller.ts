import { Request, Response } from 'express';
import * as staffService from '../services/staff.service';

export const getStaffByBusiness = async (req: Request, res: Response): Promise<void> => {
    const staff = await staffService.getStaffByBusiness(req.params.businessId);
    res.json(staff);
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
    const { businessId, name, bio, avatar_url } = req.body;
    const created = await staffService.createStaff(businessId, name, bio, avatar_url);
    res.status(201).json(created);
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
    const { name, bio, avatar_url } = req.body;
    const updated = await staffService.updateStaff(req.params.id, name, bio, avatar_url);
    res.json(updated);
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
    await staffService.deleteStaff(req.params.id);
    res.status(204).send();
};