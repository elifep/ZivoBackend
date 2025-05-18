// File: src/services/workingHour.service.ts
import pool from '../config/database';

export const getWorkingHours = async (businessId: string) => {
    const { rows } = await pool.query(
        'SELECT * FROM working_hours WHERE businessid = $1 ORDER BY weekday',
        [businessId]
    );
    return rows;
};

export const getWorkingHourById = async (id: string) => {
    const { rows } = await pool.query(
        'SELECT * FROM working_hours WHERE workhourid = $1',
        [id]
    );
    return rows[0] || null;
};

export const createWorkingHour = async (
    businessid: string,
    weekday: string,
    open_time: string,
    close_time: string
) => {
    const { rows } = await pool.query(
        `INSERT INTO working_hours (businessid, weekday, open_time, close_time)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [businessid, weekday, open_time, close_time]
    );
    return rows[0];
};

export const updateWorkingHour = async (
    workhourid: string,
    open_time: string,
    close_time: string
) => {
    const { rows } = await pool.query(
        `UPDATE working_hours
         SET open_time = $1, close_time = $2
         WHERE workhourid = $3
         RETURNING *`,
        [open_time, close_time, workhourid]
    );
    return rows[0];
};

export const deleteWorkingHour = async (workhourid: string): Promise<void> => {
    await pool.query('DELETE FROM working_hours WHERE workhourid = $1', [workhourid]);
};

export const isBusinessOwnedByUser = async (businessId: string, userid: string): Promise<boolean> => {
    console.log('businessId:', businessId);
    console.log('userid:', userid);
    const { rows } = await pool.query(
        'SELECT * FROM business WHERE businessid = $1 AND userid = $2',
        [businessId, userid]
    );
    return rows.length > 0;
};