import pool from '../config/database';
import { SocialMedia } from '../interfaces/SocialMedia';

// Tüm sosyal medya kayıtlarını getir
export const getAllSocialMedia = async (): Promise<SocialMedia[]> => {
    const { rows } = await pool.query('SELECT * FROM social_media');
    return rows;
};

// Belirli bir sosyal medya kaydını ID'ye göre getir
export const getSocialMediaById = async (id: string): Promise<SocialMedia | null> => {
    const { rows } = await pool.query('SELECT * FROM social_media WHERE socialMediaId = $1', [id]);
    return rows[0] || null;
};

// Belirli bir işletmeye ait sosyal medya hesaplarını getir
export const getSocialMediaByBusinessId = async (businessId: string): Promise<SocialMedia[]> => {
    const { rows } = await pool.query('SELECT * FROM social_media WHERE businessId = $1', [businessId]);
    return rows;
};

// Yeni bir sosyal medya kaydı oluştur
export const createSocialMedia = async (socialMedia: Omit<SocialMedia, 'socialMediaId'>): Promise<SocialMedia> => {
    const { businessId, username } = socialMedia;

    const { rows } = await pool.query(
        `INSERT INTO social_media (businessId, username)
         VALUES ($1, $2) RETURNING *`,
        [businessId, username]
    );

    return rows[0];
};

// Sosyal medya kaydını güncelle
export const updateSocialMedia = async (id: string, socialMedia: Partial<SocialMedia>): Promise<SocialMedia | null> => {
    const fields = ['businessId', 'username'];
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = fields.map(field => socialMedia[field as keyof SocialMedia]);
    values.unshift(id);

    const { rows } = await pool.query(
        `UPDATE social_media SET ${setClause} WHERE socialMediaId = $1 RETURNING *`,
        values
    );

    return rows[0] || null;
};

// Sosyal medya kaydını sil
export const deleteSocialMedia = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM social_media WHERE socialMediaId = $1', [id]);
};
