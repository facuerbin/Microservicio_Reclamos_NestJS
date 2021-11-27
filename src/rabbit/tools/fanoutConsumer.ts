import { Logger } from "@nestjs/common";
import amqp = require("amqplib");
import { RabbitProcessor, IRabbitMessage } from "./common";
import { config } from './../../config/config';


export class RabbitFanoutConsumer {
    processors = new Map<string, RabbitProcessor>();

    constructor(private exchange: string) {
    }

    addProcessor(type: string, processor: RabbitProcessor) {
        this.processors.set(type, processor);
    }

    async init() {
        try {
            const conn = await amqp.connect(config.RABBIT_HOST);
            const channel = await conn.createChannel();

            channel.on("close", function () {
                Logger.error("RabbitMQ  " + this.exchange + "  connection close, waiting 10s");
                setTimeout(() => this.init(), 10000);
            });

            Logger.log("RabbitMQ: " + this.exchange + " connected");

            const exchange = await channel.assertExchange(this.exchange, "fanout", { durable: false });
            const queue = await channel.assertQueue("", { exclusive: true });

            channel.bindQueue(queue.queue, exchange.exchange, "");
            channel.consume(queue.queue,
                (message) => {
                    const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                    if (this.processors.has(rabbitMessage.type)) {
                        this.processors.get(rabbitMessage.type)(rabbitMessage);
                    }
                }, { noAck: true });

        } catch (err) {
            Logger.error("RabbitMQ: " + this.exchange + " : " + err.message);
            setTimeout(() => this.init(), 10000);
        }
    }
}
