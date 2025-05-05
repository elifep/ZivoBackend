export interface Service {
    servicesId: string;
    businessId: string;
    staffId?: string;
    name: string;
    description?: string;
    price?: number;
    duration_min?: number;
}
