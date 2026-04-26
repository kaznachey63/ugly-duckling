import { Scheduler } from './Scheduler';
import { TelegramClient } from "telegram";

/**
 * Класс для рассылки по чатам
 */
export class Sendout {
    private readonly scheduler: Scheduler;

    constructor(client: TelegramClient) {
        this.scheduler = new Scheduler(client);
    }

    async initialize() {
        this.scheduler.start();
    }
}