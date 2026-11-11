import { Scheduler } from './Scheduler';
import { TelegramClient } from "telegram";
import type { Sendout as SendoutEntity } from '@shared/types/DataBase'; // 1. Переименовали импорт типа

/**
 * Класс для рассылки по чатам
 */
export class Sendout {
    private readonly scheduler: Scheduler;

    constructor(client: TelegramClient, targetSendout: SendoutEntity) {
        this.scheduler = new Scheduler(client, targetSendout);
    }

    async initialize() {
        this.scheduler.start();
    }
}