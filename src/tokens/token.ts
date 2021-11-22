import * as redis from "redis";
import axios from "axios";
import { GetUserDto } from "src/api/v1/complaints/dto/get.user.dto";

// Caché implementado con Redis para no tener que ir al servicio Auth cada vez que se recibe un request.
// Si el usuario existe en caché se utiliza la información de allí, sino se busca en Auth.

export interface Session {
    token: string;
    user: GetUserDto;
}
const cache = redis.createClient({url: process.env.REDIS_URL});

export async function validate(jwt: string): Promise<Session> {
    return new Promise<Session>((resolve, reject) => {
        // Buscamos el token en redis
        cache.get(jwt, (error, data) => {
            if (error) throw error;
            if (data) {
                return resolve({
                    token: jwt,
                    user: JSON.parse(data) as GetUserDto
                });
            }
        });

        // Si no está en redis lo traemos del servicio auth
        const user = axios.get<GetUserDto>(
            `${process.env.AUTH_API}/current`
            , {
                headers: {
                    'Authorization': jwt
                }
            }).then(res => {
                cache.setex(jwt, Number(process.env.REDIS_EXP), JSON.stringify(res.data));
                resolve({
                    token: jwt,
                    user:res.data
                })
            }).catch( err => {
                reject("Unauthorized "+ err.toString());
            });
    });
}

export function invalidate(token: string) {
    if (cache.get(token)) {
        cache.del(token);
        console.log("RabbitMQ session invalidada " + token);
    }
}