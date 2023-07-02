import { Request, Response } from 'express';

export const isLoggedIn = async (_req: Request, res: Response) => {
    res.sendStatus(200);
};
