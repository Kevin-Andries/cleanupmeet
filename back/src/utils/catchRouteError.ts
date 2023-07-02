import { NextFunction, Request, Response } from 'express';

type RouteFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export default (f: RouteFunction) =>
    (req: Request, res: Response, next: NextFunction) =>
        f(req, res, next).catch(next);
