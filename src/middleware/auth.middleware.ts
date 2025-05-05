import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
}

// 👇 Middleware'i doğrudan (req, res, next) alacak şekilde bırakıyoruz
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization token missing' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as AuthRequest).user = decoded; // 🔐 Type cast burada yapılıyor
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};