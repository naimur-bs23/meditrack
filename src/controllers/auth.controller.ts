import {Request, Response} from 'express';
import { User, UserRole } from '../models/user.model';
import * as jwt from 'jsonwebtoken';
import {LoginRequest, RegisterRequest} from "../requests/auth.request";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
    try {
        const registerRequest: RegisterRequest = req.body;

        if (!Object.values(UserRole).includes(registerRequest.role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }

        const user = await User.create({ ...registerRequest });
        res.status(201).json({ message: 'User registered', user });
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};

export const login = async (req: Request<LoginRequest>, res: Response): Promise<void> => {
    try {
        const loginRequest: LoginRequest = req.body;
        const user = await User.findOne({ where: { email: loginRequest.email } });

        if (!user || !(await user.validatePassword(loginRequest.password))) {
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
