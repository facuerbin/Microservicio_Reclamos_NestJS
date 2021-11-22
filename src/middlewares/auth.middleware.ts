import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GetUserDto } from 'src/api/v1/complaints/dto/get.user.dto';
import axios from 'axios';
import * as token from '../tokens/token'; 



@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const jwt = req.headers.authorization;
            const result = await token.validate(jwt);
            res.locals.user = result.user;
            res.locals.user.jwt = result.token;
        } catch (error) {
            return res.status(401).send();
        }
        next();
    }
}
