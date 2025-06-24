import {Request, Response} from 'express';
import { User, UserRole } from '../models/user.model';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        if (!Object.values(UserRole).includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }

        const user = await User.create({ name, email, password, role });
        res.status(201).json({ message: 'User registered', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.validatePassword(password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user?.id, role: user?.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token });
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};
