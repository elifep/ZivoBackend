import pool from '../config/database';
import { User } from '../interfaces/User';
import bcrypt from 'bcrypt';

export const getAllUsers = async (): Promise<User[]> => {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
};

export const getUserById = async (id: string): Promise<User | null> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE userId = $1', [id]);
    return rows[0] || null;
};

export const createUser = async (email: string, password: string, role = 'user'): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 → salt rounds
    const { rows } = await pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
        [email, hashedPassword, role]
    );
    return rows[0];
};

export const updateUser = async (id: string, email: string, role: string): Promise<User> => {
    const { rows } = await pool.query(
        'UPDATE users SET email = $1, role = $2 WHERE userId = $3 RETURNING *',
        [email, role, id]
    );
    return rows[0];
};

export const deleteUser = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM users WHERE userId = $1', [id]);
};