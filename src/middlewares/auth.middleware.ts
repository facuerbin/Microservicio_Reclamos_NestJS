import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GetUserDto } from 'src/api/v1/complaints/dto/get.user.dto';
import axios from 'axios';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const jwt = req.headers.authorization;
            res.locals.user = await axios.get<GetUserDto>(
                `${process.env.AUTH_API}/current`
                , {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(res => res.data as GetUserDto);
            res.locals.user.jwt = jwt;
        } catch (error) {
            return res.status(401).send();            
        }
        next();
    }
}
