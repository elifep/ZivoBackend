export interface Appointment {
    appointmentId: string;
    userId: string;
    businessId: string;
    servicesId: string | null;
    staffId: string | null;
    appointment_time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}  