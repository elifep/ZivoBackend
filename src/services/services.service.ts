import pool from '../config/database';
import { Service } from '../interfaces/Services';

export const getAllServices = async (): Promise<Service[]> => {
    const { rows } = await pool.query('SELECT * FROM services');
    return rows;
};

export const getServiceById = async (id: string): Promise<Service | null> => {
    const { rows } = await pool.query('SELECT * FROM services WHERE servicesId = $1', [id]);
    return rows[0] || null;
};

export const getServicesByBusinessId = async (businessId: string): Promise<Service[]> => {
    const { rows } = await pool.query('SELECT * FROM services WHERE businessId = $1', [businessId]);
    return rows;
};

export const createService = async (service: Omit<Service, 'servicesId'>): Promise<Service> => {
    const { businessId, staffId, name, description, price, duration_min } = service;

    const { rows } = await pool.query(
        `INSERT INTO services (businessId, staffId, name, description, price, duration_min)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [businessId, staffId, name, description, price, duration_min]
    );

    return rows[0];
};

export const updateService = async (id: string, service: Partial<Service>): Promise<Service | null> => {
    const fields = ['businessId', 'staffId', 'name', 'description', 'price', 'duration_min'];

    const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

    const values = fields.map(field => service[field as keyof Service]);
    values.unshift(id);

    const { rows } = await pool.query(
        `UPDATE services SET ${setClause} WHERE servicesId = $1 RETURNING *`,
        values
    );

    return rows[0] || null;
};

export const deleteService = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM services WHERE servicesId = $1', [id]);
};
