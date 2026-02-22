import { Scheduler } from '../distribution/Scheduler';
import { TelegramClient } from "telegram";

/**
 * Класс для рассылки по чатам
 */
export class Distribution {
    private readonly sheduler: Scheduler;

    constructor(client: TelegramClient) {
        this.sheduler = new Scheduler(client);
    }

    async initialize() {
        this.sheduler.start();
    }
}