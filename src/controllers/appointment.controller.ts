import { Request, Response } from 'express';
import * as service from '../services/appointment.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUserAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
    const appointments = await service.getAppointmentsByUser(req.user.userId);
    res.json(appointments);
};

export const getBusinessAppointments = async (req: Request, res: Response): Promise<void> => {
    const appointments = await service.getAppointmentsByBusiness(req.params.businessId);
    res.json(appointments);
};

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
    const { businessId, servicesId, staffId, appointment_time } = req.body;
    const appointment = await service.createAppointment(
        req.user.userId,
        businessId,
        servicesId,
        staffId,
        appointment_time
    );
    res.status(201).json(appointment);
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;
    const updated = await service.updateAppointmentStatus(req.params.id, status);
    res.json(updated);
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
    await service.deleteAppointment(req.params.id);
    res.status(204).send();
};