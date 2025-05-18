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
export const getTopRatedBusinesses = async (): Promise<Business[]> => {
    const { rows } = await pool.query(`
      SELECT b.*, AVG(r.rating) as average_rating
      FROM business b
      JOIN reviews r ON r.businessId = b.businessId
      GROUP BY b.businessId
      ORDER BY average_rating DESC
      LIMIT 10
    `);

    return rows;
};
export const getMostBookedBusinesses = async (): Promise<Business[]> => {
    const { rows } = await pool.query(`
      SELECT b.*, COUNT(a.appointmentId) as total_appointments
      FROM business b
      JOIN appointments a ON a.businessId = b.businessId
      GROUP BY b.businessId
      ORDER BY total_appointments DESC
      LIMIT 10
    `);

    return rows;
};
export const getBusinessesNearby = async (lat: number, lng: number, radiusKm: number): Promise<Business[]> => {
    const { rows } = await pool.query(
        `
      SELECT * FROM (
        SELECT *,
          (6371 * acos(
              cos(radians($1)) * cos(radians(latitude)) *
              cos(radians(longitude) - radians($2)) +
              sin(radians($1)) * sin(radians(latitude))
          )) AS distance
        FROM business
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      ) AS sub
      WHERE distance < $3
      ORDER BY distance ASC
      `,
        [lat, lng, radiusKm]
    );

    return rows;
};
export const searchBusinesses = async (filters: {
    lat?: number;
    lng?: number;
    radius?: number;
    city?: string;
    town?: string;
    query?: string;
    homeService?: boolean;
    minPrice?: number;
    maxPrice?: number;
}): Promise<Business[]> => {
    const { lat, lng, radius = 10, city, town, query } = filters;
    const values: any[] = [];
    let whereClauses: string[] = [];

    let distanceExpr = '';
    if (lat && lng) {
        distanceExpr = `
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance
      `;
        values.push(lat, lng);
    }

    if (city) {
        values.push(city);
        whereClauses.push(`LOWER(city) = LOWER($${values.length})`);
    }

    if (town) {
        values.push(town);
        whereClauses.push(`LOWER(town) = LOWER($${values.length})`);
    }

    if (query) {
        values.push(`%${query.toLowerCase()}%`);
        whereClauses.push(`LOWER(businessName) LIKE $${values.length}`);
    }
    if (filters.homeService === true) {
        whereClauses.push(`homeService = true`);
    }
    if (filters.minPrice !== undefined) {
        values.push(filters.minPrice);
        whereClauses.push(`EXISTS (
            SELECT 1 FROM services s WHERE s.businessId = sub.businessId AND s.price >= $${values.length}
        )`);
    }

    if (filters.maxPrice !== undefined) {
        values.push(filters.maxPrice);
        whereClauses.push(`EXISTS (
            SELECT 1 FROM services s WHERE s.businessId = sub.businessId AND s.price <= $${values.length}
        )`);
    }

    const whereSQL = whereClauses.length > 0 ? `(${whereClauses.join(' AND ')})` : '';
    const conditionSQL = lat && lng ? `distance <= $${values.length + 1}` : '';
    if (lat && lng) values.push(radius);

    const finalWhere = [conditionSQL, whereSQL].filter(Boolean).join(' AND ');

    const querySQL = `
      SELECT * FROM (
        SELECT *,
        ${distanceExpr || 'NULL as distance'}
        FROM business
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      ) AS sub
      ${finalWhere ? `WHERE ${finalWhere}` : ''}
      ORDER BY ${lat && lng ? 'distance' : 'businessName'} ASC
    `;

    const { rows } = await pool.query(querySQL, values);
    return rows;
};

export const createBusiness = async (business: Omit<Business, 'businessId'>): Promise<Business> => {
    const {
        userId, businessName, name, businessPhone, description,
        city, town, adressLine1, adressLine2, image_url,
        latitude, longitude, homeService = false
    } = business;

    const { rows } = await pool.query(
        `INSERT INTO business (
        userId, businessName, name, businessPhone, description,
        city, town, adressLine1, adressLine2, image_url,
        latitude, longitude, homeService
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [userId, businessName, name, businessPhone, description,
            city, town, adressLine1, adressLine2, image_url,
            latitude, longitude, homeService]
    );

    return rows[0];
};

export const updateBusiness = async (id: string, business: Partial<Business>): Promise<Business | null> => {
    const entries = Object.entries(business).filter(([_, value]) => value !== undefined);

    if (entries.length === 0) return null;

    const setClause = entries.map(([key], i) => `${key} = $${i + 2}`).join(', ');
    const values = entries.map(([_, value]) => value);
    values.unshift(id); // $1 → businessId

    const { rows } = await pool.query(
        `UPDATE business SET ${setClause} WHERE businessId = $1 RETURNING *`,
        values
    );

    return rows[0] || null;
};

export const deleteBusiness = async (id: string): Promise<void> => {
    await pool.query('DELETE FROM business WHERE businessId = $1', [id]);
};