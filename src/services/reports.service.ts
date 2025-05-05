import pool from '../config/database';
import { Report } from '../interfaces/Reports';

export const getAllReports = async (): Promise<Report[]> => {
    const { rows } = await pool.query('SELECT * FROM reports');
    return rows;
};

export const getReportById = async (id: string): Promise<Report | null> => {
    const { rows } = await pool.query('SELECT * FROM reports WHERE reportId = $1', [id]);
    return rows[0] || null;
};

export const getReportsByBusinessId = async (businessId: string): Promise<Report[]> => {
    const { rows } = await pool.query('SELECT * FROM reports WHERE businessId = $1', [businessId]);
    return rows;
};

export const createReport = async (report: Omit<Report, 'reportId' | 'created_at'>): Promise<Report> => {
    const { businessId, userId, staffId, message, status } = report;

    const { rows } = await pool.query(
        `INSERT INTO reports (businessId, userId, staffId, message, status)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [businessId, userId, staffId, message, status]
    );

    return rows[0];
};

export const updateReportStatus = async (id: string, status: 'pending' | 'resolved' | 'rejected'): Promise<Report | null> => {
    const { rows } = await pool.query(
        `UPDATE reports SET status = $1 WHERE reportId = $2 RETURNING *`,
        [status, id]
    );

    return rows[0] || null;
};

export const deleteReport = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM reports WHERE reportId = $1', [id]);
};
