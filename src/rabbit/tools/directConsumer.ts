"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import amqp = require("amqplib");
import { RabbitProcessor, IRabbitMessage } from "./common";

export class RabbitDirectConsumer {
    processors = new Map<string, RabbitProcessor>();

    constructor(private queue: string, private exchange: string) {
    }

    addProcessor(type: string, processor: RabbitProcessor) {
        this.processors.set(type, processor);
    }

    /**
     * Escucha eventos específicos de cart.
     *
     * article-exist : Es un evento que lo envía Catalog indicando que un articulo existe y es valido para el cart.
     */
    async init() {
        try {
            const conn = await amqp.connect(process.env.RABBIT_URL);

            const channel = await conn.createChannel();

            channel.on("close", function () {
                console.error("RabbitMQ  " + this.exchange + " conexión cerrada, intentado reconecta en 10'");
                setTimeout(() => this.init(), 10000);
            });

            console.log("RabbitMQ " + this.exchange + " conectado");

            const exchange = await channel.assertExchange(this.exchange, "direct", { durable: false });

            const queue = await channel.assertQueue(this.queue, { durable: false });

            channel.bindQueue(queue.queue, exchange.exchange, queue.queue);

            channel.consume(queue.queue,
                (message) => {
                    const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                    if (this.processors.has(rabbitMessage.type)) {
                        this.processors.get(rabbitMessage.type)(rabbitMessage);
                    }
                }, { noAck: true });
        } catch (err) {
            console.error("RabbitMQ " + this.exchange + " " + err.message);
            setTimeout(() => this.init(), 10000);
        }
    }
}