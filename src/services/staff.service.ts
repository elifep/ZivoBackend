import pool from '../config/database';
import { Staff } from '../interfaces/Staff';

export const getStaffByBusiness = async (businessId: string): Promise<Staff[]> => {
    const { rows } = await pool.query('SELECT * FROM staff WHERE businessId = $1', [businessId]);
    return rows;
};

export const createStaff = async (
    businessId: string,
    name: string,
    bio?: string,
    avatar_url?: string
): Promise<Staff> => {
    const { rows } = await pool.query(
        `INSERT INTO staff (businessId, name, bio, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [businessId, name, bio, avatar_url]
    );
    return rows[0];
};

export const updateStaff = async (
    staffId: string,
    name: string,
    bio?: string,
    avatar_url?: string
): Promise<Staff> => {
    const { rows } = await pool.query(
        `UPDATE staff
     SET name = $1, bio = $2, avatar_url = $3
     WHERE staffId = $4
     RETURNING *`,
        [name, bio, avatar_url, staffId]
    );
    return rows[0];
};

export const deleteStaff = async (staffId: string): Promise<void> => {
    await pool.query('DELETE FROM staff WHERE staffId = $1', [staffId]);
};