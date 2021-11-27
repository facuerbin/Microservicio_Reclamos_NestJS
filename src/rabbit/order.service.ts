import { Logger } from "@nestjs/common";
import { ComplaintSchema } from "src/api/v1/complaints/complaint.schema";
import { Status } from "src/api/v1/complaints/entities/Status";
import { RabbitTopicConsumer } from "./tools/topicConsumer";
import { config } from './../config/config';

interface IRabbitMessage {
    type: string;
    message: OrderCanceledEvent;
}

export function init() {
    const topic = new RabbitTopicConsumer("order", "order-canceled", "order-canceled");
    topic.addProcessor("order-canceled", processCanceled);
    topic.init();
}

/**
 * @api {topic} order/order_canceled Ordenes Canceladas
 * @apiGroup RabbitMQ GET
 *
 * @apiDescription Escucha los mensajes ordenes canceladas desde el servicio orders.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "logout",
 *        "message": "{
 *                      objectID:string,
 *                      reason; string,
 *                      userId: string
 *                     }"
 *     }
 */
async function processCanceled(rabbitMessage: IRabbitMessage) {
    Logger.log(`RabbitMQ: Order ${rabbitMessage.message.orderId} canceled`);
    const mongoose = require("mongoose");
    const db = await mongoose.connect(`mongodb://localhost:${config.DB_PORT}/complaints`);
    db.model("complaints", ComplaintSchema)
        .findOne({ orderId: rabbitMessage.message.orderId, status: Status.Active }).exec()
        .then(complaint => {
            complaint.status = Status.Canceled;
            complaint.save();
            Logger.log(`Complaint: ${complaint.id} was canceled`);
        })
        .catch(error => {
            Logger.error("Error al recibir cancelar orden", error.toString());
        })
}

export class OrderCanceledEvent {
    orderId: String;
    reason: String;
    userId: String;

    constructor(builder) {
        this.orderId = builder.orderId;
        this.reason = builder.reason;
        this.userId = builder.userId;
    }
}