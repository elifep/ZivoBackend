export interface Review {
    reviewsId: string;
    businessId: string;
    userId: string;
    rating: number;
    comment: string | null;
}  