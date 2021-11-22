"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
//import * as token from "../token";
import { RabbitFanoutConsumer } from "./tools/fanoutConsumer";
import * as token from "./../tokens/token";

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
 * @apiDescription Escucha de mensajes logout desde auth.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "logout",
 *        "message": "{tokenId}"
 *     }
 */
function processLogout(rabbitMessage: IRabbitMessage) {
    console.log("RabbitMQ Consume logout " + rabbitMessage.message);
    token.invalidate(rabbitMessage.message);
}
