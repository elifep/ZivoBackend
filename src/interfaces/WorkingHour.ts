export type Weekday = 
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface WorkingHour {
    businessId: string;
    weekday: Weekday;
    isOpen: boolean;
    openTime?: string;  // "09:00:00" - sadece isOpen true ise
    closeTime?: string; // "18:00:00"
}
