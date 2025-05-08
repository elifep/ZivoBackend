import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import bcrypt from 'bcrypt';
import { createEmptyProfile } from '../services/profile.service';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    const emailLower = email.toLowerCase();
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [emailLower]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }

    const accessToken = jwt.sign(
        { userId: user.userid, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' } // kısa ömürlü
    );

    const refreshToken = jwt.sign(
        { userId: user.userid },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' } // 7 gün geçerli
    );

    res.json({
        accessToken,
        refreshToken,
        user: {
            userId: user.userid,
            email: user.email,
            role: user.role
        }
    });
};
export const refreshToken = (req: Request, res: Response): void => {
    const { token } = req.body;

    if (!token) {
        res.status(401).json({ message: 'Refresh token missing' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role = 'user' } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    try {
        // Email zaten kayıtlı mı?
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Veritabanına ekle
        const { rows } = await pool.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
            [email, hashedPassword, role]
        );
        const user = rows[0];
        // 👇 Otomatik boş profil oluştur
        await createEmptyProfile(user.userid);

        // Token üret
        const accessToken = jwt.sign(
            { userId: user.userid, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.userid },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            refreshToken,
            user: {
                userId: user.userid,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};