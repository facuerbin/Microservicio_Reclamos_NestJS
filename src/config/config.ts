import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});
export interface Iconfig {
    NODE_ENV: string,

    HOST: string,
    PORT: string,

    DB_PORT: Number,
    DB_NAME: string,

    ORDERS_API: string,
    AUTH_API: string,

    RABBIT_URL: string,
    REDIS_URL: string,
    REDIS_EXP: Number,
}
export const config: Iconfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',

    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || '3005',

    DB_PORT: Number(process.env.DB_PORT) || 27017,
    DB_NAME: process.env.DB_NAME || 'complaints',

    ORDERS_API: process.env.ORDERS_API || 'http://localhost:3004/v1/orders',
    AUTH_API: process.env.AUTH_API || 'http://localhost:3000/v1/users',

    RABBIT_URL: process.env.RABBIT_URL || 'amqp://localhost',
    REDIS_URL: process.env.REDIS_URL || 'http://localhost:6379',
    REDIS_EXP: Number(process.env.REDIS_EXP) || 3600 // Cache expiration time in s
}