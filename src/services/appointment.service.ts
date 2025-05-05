import pool from '../config/database';
import { Appointment } from '../interfaces/Appointment';

export const getAppointmentsByUser = async (userId: string): Promise<Appointment[]> => {
    const { rows } = await pool.query('SELECT * FROM appointments WHERE userId = $1', [userId]);
    return rows;
};

export const getAppointmentsByBusiness = async (businessId: string): Promise<Appointment[]> => {
    const { rows } = await pool.query('SELECT * FROM appointments WHERE businessId = $1', [businessId]);
    return rows;
};

export const createAppointment = async (
    userId: string,
    businessId: string,
    servicesId: string,
    staffId: string,
    appointment_time: string
): Promise<Appointment> => {
    const { rows } = await pool.query(
        `INSERT INTO appointments (userId, businessId, servicesId, staffId, appointment_time)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, businessId, servicesId, staffId, appointment_time]
    );
    return rows[0];
};

export const updateAppointmentStatus = async (
    appointmentId: string,
    status: string
): Promise<Appointment> => {
    const { rows } = await pool.query(
        `UPDATE appointments SET status = $1 WHERE appointmentId = $2 RETURNING *`,
        [status, appointmentId]
    );
    return rows[0];
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
    await pool.query('DELETE FROM appointments WHERE appointmentId = $1', [appointmentId]);
};