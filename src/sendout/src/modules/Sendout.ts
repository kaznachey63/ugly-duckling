import { Scheduler } from './Scheduler';
import { TelegramClient } from "telegram";
import type { Sendout as SendoutEntity } from '@shared/types/DB'; // 1. Переименовали импорт типа

/**
 * Класс для рассылки по чатам
 */
export class Sendout {
    private readonly scheduler: Scheduler;

    constructor(client: TelegramClient) {
        this.scheduler = new Scheduler(client);
    }

    async initialize(targetSendout: SendoutEntity) {
        this.scheduler.start(targetSendout);
    }
}