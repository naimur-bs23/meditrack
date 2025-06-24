import {Request, Response, NextFunction} from "express";

export function authorize(allowRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

        if(!allowRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden: Invalid role' });
        }

        next();
    }
}