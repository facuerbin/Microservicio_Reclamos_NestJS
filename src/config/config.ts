import * as dotenv from 'dotenv';
import * as path from 'path';


dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`).replace("dist", "src")
});

export interface Iconfig {
    NODE_ENV: string,

    HOST: string,
    PORT: string,

    DB_HOST: string,
    DB_PORT: number,
    DB_NAME: string,

    ORDERS_API: string,
    AUTH_API: string,

    RABBIT_HOST: string,
    REDIS_HOST: string,
    REDIS_EXP: number,
}
export const config: Iconfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',

    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || '3005',

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: Number(process.env.DB_PORT) || 27017,
    DB_NAME: process.env.DB_NAME || 'complaints',

    ORDERS_API: process.env.ORDERS_API || 'http://localhost:3004/v1/orders',
    AUTH_API: process.env.AUTH_API || 'http://localhost:3000/v1/users',

    RABBIT_HOST: process.env.RABBIT_HOST || 'amqp://localhost',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_EXP: Number(process.env.REDIS_EXP) || 3600 // Cache expiration time in s
}