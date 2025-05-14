import pool from '../config/database';
import { Appointment } from '../interfaces/Appointment';

export const getAppointmentsByUser = async (userId: string): Promise<Appointment[]> => {
    const { rows } = await pool.query('SELECT * FROM appointments WHERE userId = $1', [userId]);
    return rows;
};

export const getAppointmentsByBusiness = async (businessId: string): Promise<Appointment[]> => {
    const { rows } = await pool.query('SELECT * FROM appointments WHERE businessId = $1', [businessId]);
    return rows;
};

export const createAppointment = async (
    userId: string,
    businessId: string,
    servicesId: string,
    staffId: string | null,
    appointment_time: string
): Promise<Appointment> => {
    const { rows: serviceRows } = await pool.query(
        'SELECT duration_min FROM services WHERE servicesid = $1',
        [servicesId]
    );

    if (serviceRows.length === 0 || !serviceRows[0].duration_min) {
        throw new Error('Hizmet süresi tanımlı değil.');
    }

    const durationMin = serviceRows[0].duration_min;

    // Gelen ISO tarih (örnek: 2025-06-10T17:00:00)
    const [datePart, timePart] = appointment_time.split('T');
    const [hour, minute] = timePart.split(':').map(Number);

    // Başlangıç zamanı düz string (örnek: "2025-06-10 17:00:00")
    const start = `${datePart} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;

    // Bitiş zamanı hesapla (sadece çakışma kontrolü için)
    const totalMinutes = hour * 60 + minute + durationMin;
    const endHour = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const endMin = (totalMinutes % 60).toString().padStart(2, '0');
    const end = `${datePart} ${endHour}:${endMin}:00`;

    // Çakışma kontrolü (string karşılaştırmalı)
    const { rows: conflicts } = await pool.query(
        `
      SELECT 1
      FROM appointments a
      JOIN services s ON a.servicesid = s.servicesid
      WHERE a.userid = $1
        AND a.status = 'active'
        AND (
          a.appointment_time < to_timestamp($3, 'YYYY-MM-DD HH24:MI:SS')
          AND a.appointment_time + (s.duration_min || ' minutes')::interval > to_timestamp($2, 'YYYY-MM-DD HH24:MI:SS')
        )
      LIMIT 1;
      `,
        [userId, start, end]
    );

    if (conflicts.length > 0) {
        throw new Error('Bu saat aralığında başka bir randevunuz zaten var.');
    }

    // Randevuyu oluştur (!!! UTC etkisi yok çünkü string olarak veriyoruz)
    const { rows } = await pool.query(
        `INSERT INTO appointments (userId, businessId, servicesId, staffId, appointment_time)
       VALUES ($1, $2, $3, $4, to_timestamp($5, 'YYYY-MM-DD HH24:MI:SS')) RETURNING *`,
        [userId, businessId, servicesId, staffId, start]
    );

    return rows[0];
};

export const updateAppointmentStatus = async (
    appointmentId: string,
    status: 'active' | 'cancelled'
): Promise<Appointment | null> => {
    // Randevuyu getir
    const { rows } = await pool.query(
        `SELECT * FROM appointments WHERE appointmentId = $1`,
        [appointmentId]
    );
    const appointment = rows[0];
    if (!appointment) throw new Error('Appointment not found');

    const now = new Date();
    const appointmentTime = new Date(appointment.appointment_time);
    const diffHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Eğer randevuya 2 saatten az kaldıysa, güncellenemez
    if (diffHours < 2) {
        throw new Error('Randevu 2 saatten az kaldığı için iptal veya düzenleme yapılamaz.');
    }

    const { rows: updatedRows } = await pool.query(
        `UPDATE appointments SET status = $1 WHERE appointmentId = $2 RETURNING *`,
        [status, appointmentId]
    );

    return updatedRows[0];
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
    await pool.query('DELETE FROM appointments WHERE appointmentId = $1', [appointmentId]);
};