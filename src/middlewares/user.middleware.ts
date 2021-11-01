import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class UserMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        if (res.locals.user && res.locals.user.permissions.indexOf("user") > -1 ){
            next();
        } else {
            return res.status(400).send();
        }
    }
}