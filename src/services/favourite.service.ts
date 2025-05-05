import pool from '../config/database';
import { Favourite } from '../interfaces/Favourite';

export const getAllFavourites = async (): Promise<Favourite[]> => {
    const { rows } = await pool.query('SELECT * FROM favourites');
    return rows;
};

export const getFavouritesByUserId = async (userId: string): Promise<Favourite[]> => {
    const { rows } = await pool.query('SELECT * FROM favourites WHERE userId = $1', [userId]);
    return rows;
};

export const addFavourite = async (userId: string, businessId: string): Promise<Favourite> => {
    const { rows } = await pool.query(
        'INSERT INTO favourites (userId, businessId) VALUES ($1, $2) RETURNING *',
        [userId, businessId]
    );
    return rows[0];
};

export const removeFavourite = async (userId: string, businessId: string): Promise<void> => {
    await pool.query('DELETE FROM favourites WHERE userId = $1 AND businessId = $2', [userId, businessId]);
};