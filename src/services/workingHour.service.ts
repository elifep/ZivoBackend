import pool from '../config/database';
import { WorkingHour } from '../interfaces/WorkingHour';

export const getWorkingHours = async (businessId: string): Promise<WorkingHour[]> => {
    const { rows } = await pool.query(
        'SELECT * FROM working_hours WHERE businessId = $1 ORDER BY weekday',
        [businessId]
    );
    return rows;
};

export const createWorkingHour = async (
    businessId: string,
    weekday: string,
    open_time: string,
    close_time: string
): Promise<WorkingHour> => {
    const { rows } = await pool.query(
        `INSERT INTO working_hours (businessId, weekday, open_time, close_time)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [businessId, weekday, open_time, close_time]
    );
    return rows[0];
};

export const updateWorkingHour = async (
    workhourId: string,
    open_time: string,
    close_time: string
): Promise<WorkingHour> => {
    const { rows } = await pool.query(
        `UPDATE working_hours SET open_time = $1, close_time = $2 WHERE workhourId = $3 RETURNING *`,
        [open_time, close_time, workhourId]
    );
    return rows[0];
};

export const deleteWorkingHour = async (workhourId: string): Promise<void> => {
    await pool.query('DELETE FROM working_hours WHERE workhourId = $1', [workhourId]);
};