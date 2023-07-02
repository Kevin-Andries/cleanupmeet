import { Request, Response } from 'express';

export const logOut = async (_req: Request, res: Response) => {
    res.clearCookie('token');
    res.sendStatus(200);
};
