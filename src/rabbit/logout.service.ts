import { RabbitFanoutConsumer } from "./tools/fanoutConsumer";
import * as token from "../tokens/token";
import { Logger } from "@nestjs/common";

interface IRabbitMessage {
    type: string;
    message: any;
}

export function init() {
    const fanout = new RabbitFanoutConsumer("auth");
    fanout.addProcessor("logout", processLogout);
    fanout.init();
}

/**
 * @api {fanout} auth/logout Logout de Usuarios
 * @apiGroup RabbitMQ GET
 *
 * @apiDescription Escucha de mensajes logout desde el servicio auth.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "logout",
 *        "message": "{tokenId}"
 *     }
 */
function processLogout(rabbitMessage: IRabbitMessage) {
    Logger.log("RabbitMQ: Consume logout " + rabbitMessage.message);
    token.invalidate(rabbitMessage.message);
}
