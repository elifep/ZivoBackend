// src/interfaces/Profile.ts
export interface Profile {
    profileId: string;
    userId: string;
    phone: string | null;
    birthday: string | null;
    gender: string | null;
    address: string | null;
    full_name: string | null;
    image_url: string | null;
}  