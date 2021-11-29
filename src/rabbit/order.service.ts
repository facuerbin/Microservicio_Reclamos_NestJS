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
    const db = await mongoose.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);
    db.model("complaints", ComplaintSchema)
        .findOne({ orderId: rabbitMessage.message.orderId, status: Status.Active }).exec()
        .then(complaint => {
            if (complaint && complaint.status) {
                complaint.status = Status.Canceled;
                complaint.save();
                Logger.log(`Complaint: ${complaint.id} was canceled`);
            } else {
                Logger.error(`Complaint: ${complaint.id} there is no active complaint for that orderId`);
            }
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