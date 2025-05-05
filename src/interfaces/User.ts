export interface User {
    userId: string;
    email: string;
    password: string;
    role: 'user' | 'business' | 'admin';
    createdAt: Date;
}  