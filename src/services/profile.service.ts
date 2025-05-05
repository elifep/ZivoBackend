// src/services/profile.service.ts
import pool from '../config/database';
import { Profile } from '../interfaces/Profile';

export const getAllProfiles = async (): Promise<Profile[]> => {
    const { rows } = await pool.query('SELECT * FROM profile');
    return rows;
};

export const getProfileById = async (id: string): Promise<Profile | null> => {
    const { rows } = await pool.query('SELECT * FROM profile WHERE profileId = $1', [id]);
    return rows[0] || null;
};

export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
    const { rows } = await pool.query('SELECT * FROM profile WHERE userId = $1', [userId]);
    return rows[0] || null;
};

export const createProfile = async (profile: Omit<Profile, 'profileId'>): Promise<Profile> => {
    const { userId, phone, birthday, gender, address, full_name, image_url } = profile;

    const { rows } = await pool.query(
        `INSERT INTO profile (userId, phone, birthday, gender, address, full_name, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [userId, phone, birthday, gender, address, full_name, image_url]
    );

    return rows[0];
};
export const createEmptyProfile = async (userId: string): Promise<void> => {
    await pool.query(
        `INSERT INTO profile (userId, phone, birthday, gender, address, full_name, image_url)
       VALUES ($1, NULL, NULL, NULL, NULL, NULL, NULL)`,
        [userId]
    );
};

export const updateProfile = async (id: string, profile: Partial<Profile>): Promise<Profile> => {
    const fields = [
        'phone', 'birthday', 'gender', 'address', 'full_name', 'image_url'
    ];

    const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

    const values = fields.map(field => profile[field as keyof Profile]);
    values.unshift(id);

    const { rows } = await pool.query(
        `UPDATE profile SET ${setClause} WHERE profileId = $1 RETURNING *`,
        values
    );

    return rows[0];
};
export const updateProfileByUserId = async (userId: string, profile: Partial<Profile>): Promise<Profile> => {
    const fields = ['phone', 'birthday', 'gender', 'address', 'full_name', 'image_url'];

    const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

    const values = fields.map(field => profile[field as keyof Profile]);
    values.unshift(userId);

    const { rows } = await pool.query(
        `UPDATE profile SET ${setClause} WHERE userId = $1 RETURNING *`,
        values
    );

    return rows[0];
};

export const deleteProfile = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM profile WHERE profileId = $1', [id]);
};
export const deleteProfileByUserId = async (userId: string): Promise<void> => {
    await pool.query('DELETE FROM profile WHERE userId = $1', [userId]);
};  