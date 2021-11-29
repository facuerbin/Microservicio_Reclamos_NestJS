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

/*
 * {fanout} auth/logout Logout de Usuarios
 */
function processLogout(rabbitMessage: IRabbitMessage) {
    Logger.log("RabbitMQ: Consume logout " + rabbitMessage.message);
    token.invalidate(rabbitMessage.message);
}
