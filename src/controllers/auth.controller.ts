import {Request, Response} from "express";

export const register = (req: Request, res: Response) => {
    console.log(`request URL: ${req.method} -> ${req.baseUrl}`);
    res.json({'reg': 'register'});
}
