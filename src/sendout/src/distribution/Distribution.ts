import { Scheduler } from '../distribution/Scheduler';
import { TelegramClient } from "telegram";

/**
 * Класс для рассылки по чатам
 */
export class Distribution {
    private readonly scheduler: Scheduler;

    constructor(client: TelegramClient) {
        this.scheduler = new Scheduler(client);
    }

    async initialize() {
        this.scheduler.start();
    }
}