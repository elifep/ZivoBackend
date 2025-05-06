import pool from '../config/database';
import { Business } from '../interfaces/Business';

export const getAllBusinesses = async (): Promise<Business[]> => {
    const { rows } = await pool.query('SELECT * FROM business');
    return rows;
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
    const { rows } = await pool.query('SELECT * FROM business WHERE businessId = $1', [id]);
    return rows[0] || null;
};

export const getBusinessesByUserId = async (userId: string): Promise<Business[]> => {
    const { rows } = await pool.query('SELECT * FROM business WHERE userId = $1', [userId]);
    return rows;
};

export const createBusiness = async (business: Omit<Business, 'businessId'>): Promise<Business> => {
    const { userId, businessName, name, businessPhone, description, address, city, town, adressLine1, adressLine2, image_url } = business;

    const { rows } = await pool.query(
        `INSERT INTO business (userId, businessName, name, businessPhone, description, address, city, town, adressLine1, adressLine2, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [userId, businessName, name, businessPhone, description, address, city, town, adressLine1, adressLine2, image_url]
    );

    return rows[0];
};

export const updateBusiness = async (id: string, business: Partial<Business>): Promise<Business | null> => {
    const fields = ['businessName', 'name', 'businessPhone', 'description', 'address', 'city', 'town', 'adressLine1', 'adressLine2', 'image_url'];

    const setClause = fields
        .map((field, index) => `${field} = ${index + 2}`)
        .join(', ');

    const values = fields.map(field => business[field as keyof Business]);
    values.unshift(id);

    const { rows } = await pool.query(
        `UPDATE business SET ${setClause} WHERE businessId = $1 RETURNING *`,
        values
    );

    return rows[0] || null;
};

export const deleteBusiness = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM business WHERE businessId = $1', [id]);
};