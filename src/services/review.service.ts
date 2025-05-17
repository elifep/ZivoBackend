import pool from '../config/database';
import { Review } from '../interfaces/Review';

export const getAllReviews = async (): Promise<Review[]> => {
    const { rows } = await pool.query('SELECT * FROM reviews');
    return rows;
};

export const getReviewById = async (id: string): Promise<Review | null> => {
    const { rows } = await pool.query(`
      SELECT 
        reviewsid AS "reviewsId",
        businessid AS "businessId",
        userid AS "userId",
        rating,
        comment
      FROM reviews
      WHERE reviewsid = $1
    `, [id]);

    return rows[0] || null;
};

export const getReviewsByBusinessId = async (businessId: string): Promise<Review[]> => {
    const { rows } = await pool.query(
        `SELECT r.*, p.full_name, p.image_url
         FROM reviews r
         JOIN profiles p ON r.userId = p.userId
         WHERE r.businessId = $1`,
        [businessId]
    );

    return rows.map((r) => ({
        reviewsId: r.reviewsid,
        businessId: r.businessid,
        userId: r.userid,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        user: {
            full_name: r.full_name,
            image_url: r.image_url,
        }
    }));
};

export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
    const { rows } = await pool.query(
        'SELECT * FROM reviews WHERE userId = $1',
        [userId]
    );
    return rows;
};
export const getAverageRatingAndTotalByBusinessId = async (
    businessId: string
): Promise<{ average: number; total: number }> => {
    const { rows } = await pool.query(
        `SELECT AVG(rating)::numeric(10,2) AS average, COUNT(*) AS total
       FROM reviews WHERE businessId = $1`,
        [businessId]
    );

    return {
        average: Number(rows[0].average ?? 0),
        total: Number(rows[0].total ?? 0)
    };
};
export const hasUserReviewedBusiness = async (
    userId: string,
    businessId: string
): Promise<boolean> => {
    const { rows } = await pool.query(
        `SELECT 1 FROM reviews WHERE userId = $1 AND businessId = $2 LIMIT 1`,
        [userId, businessId]
    );
    return rows.length > 0;
};

export const createReview = async (
    businessId: string,
    userId: string,
    rating: number,
    comment: string
): Promise<Review> => {
    const { rows } = await pool.query(
        `INSERT INTO reviews (businessId, userId, rating, comment)
     VALUES ($1, $2, $3, $4) RETURNING *`,
        [businessId, userId, rating, comment]
    );
    return rows[0];
};

export const updateReview = async (
    id: string,
    rating: number,
    comment: string
): Promise<Review> => {
    const { rows } = await pool.query(
        `UPDATE reviews SET rating = $1, comment = $2 WHERE reviewsId = $3 RETURNING *`,
        [rating, comment, id]
    );
    return rows[0];
};

export const deleteReview = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM reviews WHERE reviewsId = $1', [id]);
};