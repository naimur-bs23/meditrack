import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Authentication token required' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded as { id: number; role: string };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid authentication token' });
    }
};