import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
    file?: Express.Multer.File;
    files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}

interface DecodedToken extends JwtPayload {
    role: 'user' | 'business';
    userId: string;
}

export const authenticate =
    (allowedRoles: ('user' | 'business')[]) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Authorization token missing' });
                return;
            }

            const token = authHeader.split(' ')[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

                if (!allowedRoles.includes(decoded.role)) {
                    res.status(403).json({ message: 'Unauthorized role access' }); // ✅ sadece bu şekilde bırak
                    return; // ❗ bu gerekli çünkü next() çağrılmayacak
                }

                (req as AuthRequest).user = decoded;
                next();
            } catch (err) {
                res.status(401).json({ message: 'Invalid token' });
            }
        };