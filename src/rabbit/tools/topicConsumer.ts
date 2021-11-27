import { Logger } from "@nestjs/common";
import amqp = require("amqplib");
import { RabbitProcessor, IRabbitMessage } from "./common";
import { config } from './../../config/config';

export class RabbitTopicConsumer {
    processors = new Map<string, RabbitProcessor>();

    constructor(private queue: string, private exchange: string, private topic: string) {
    }

    addProcessor(type: string, processor: RabbitProcessor) {
        this.processors.set(type, processor);
    }

    async init() {
        try {
            const conn = await amqp.connect(config.RABBIT_URL);
            const channel = await conn.createChannel();

            channel.on("close", function () {
                Logger.error("RabbitMQ: " + this.exchange + " connection closed, waiting 10s");
                setTimeout(() => this.init(), 10000);
            });

            Logger.log("RabbitMQ: " + this.exchange + " connected");

            const exchange = await channel.assertExchange(this.exchange, "topic", { durable: false });
            const queue = await channel.assertQueue(this.queue, { durable: false, exclusive: false, autoDelete: false });

            channel.bindQueue(this.queue, this.exchange, this.topic);
            channel.consume(queue.queue,
                (message) => {
                    const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                    if (this.processors.has(rabbitMessage.type)) {
                        this.processors.get(rabbitMessage.type)(rabbitMessage);
                    }
                }, { noAck: true });
        } catch (err) {
            Logger.error("RabbitMQ: " + this.exchange + " " + err.message);
            setTimeout(() => this.init(), 10000);
        }
    }
}

