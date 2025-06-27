import {Request, Response, NextFunction} from "express";

export const authorize = (allowRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;
        if (!user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }
        if(!allowRoles.includes(user.role)) {
            res.status(403).json({ message: 'Forbidden: Invalid role' });
            return;
        }
        next();
    }
}