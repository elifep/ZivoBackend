import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await userService.getAllUsers();
    res.json(users); // ❗ return yok
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body;
    const user = await userService.createUser(email, password, role);
    res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { email, role } = req.body;
    const user = await userService.updateUser(req.params.id, email, role);
    res.json(user);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
};