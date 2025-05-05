export interface Report {
    reportId: string;
    businessId: string;
    userId?: string;
    staffId?: string;
    message: string;
    status: 'pending' | 'resolved' | 'rejected';
    created_at: Date;
}
