import type { Counter } from "@shared/types/Counter";
import type { ChatWithPermission } from "@shared/types/ChatWithPermission";
import type { Chat, Message, Sendout } from '@shared/types/DB';

import utils from '../utils';
import db from '@shared/db';
import { TelegramClient, Api } from "telegram";
import { Sender } from './Sender';
import cron from 'node-cron';

export class Scheduler {
    private readonly sender: Sender;
    private readonly sendout: Sendout;

    constructor(private readonly client: TelegramClient, sendout: Sendout) {
        this.sender = new Sender(client);
        this.sendout = sendout;
    }

    async start() {
        const times = await db.schedule.get(this.sendout.id!);
        const messages = await db.message.getMessages(this.sendout.id!);
        const chats = await db.chat.get();
        
        if (!chats || !chats.length) {
            console.log('⚠️  Нет чатов для рассылки');
            return;
        }

        if (!times || !times.length) {
            console.log('⚠️  Нет времени для рассылки');
            return;
        }

        if (!messages || !messages.length) {
            console.log('⚠️  Нет сообщений для рассылки');
            return;
        }
        this.getSendingStats(chats);
        times.forEach((time) => {
            cron.schedule(time.cron!, async () => {
                await db.sendout.setActive(this.sendout.id!, true);

                // 👇 Передаём time.id вместо index
                await this.execute(new Date(), time.id!, messages, chats);
            }, { timezone: "Europe/Moscow" });
        });
    }

    public async getSendingStats(allChats: Chat[]): Promise<{
        totalInDb: number;
        accessible: number;
        canSend: number;
        cannotSend: number;
    }> {
        if (!this.client.connected) {
            await this.client.connect();
        }
        const accessible = await this.getAccessibleChatsSilent(allChats);
        const permissions = await this.checkWritePermissionsSilent(accessible);
        const canSendCount = permissions.filter(p => p.canSend).length;
        const cannotSendCount = permissions.length - canSendCount;

        console.log(`📊 Статистика рассылки:`);
        console.log(`   Всего чатов в БД: ${allChats.length}`);
        console.log(`   Аккаунт состоит в: ${accessible.length}`);
        console.log(`   Можно писать: ${canSendCount}`);
        console.log(`   Нельзя писать: ${cannotSendCount}`);

        return {
            totalInDb: allChats.length,
            accessible: accessible.length,
            canSend: canSendCount,
            cannotSend: cannotSendCount
        };
    }

    private async getAccessibleChatsSilent(allChats: Chat[]): Promise<Chat[]> {
        const dialogs = await this.client.getDialogs({});
        const accessibleIds = new Set<string>();
        for (const dialog of dialogs) {
            const entity = dialog.entity;
            if (entity?.className === 'Channel' || entity?.className === 'Chat') {
                accessibleIds.add(String(`-100${entity?.id}`));
            }
        }
        return allChats.filter(chat => accessibleIds.has(String(chat.id)));
    }

    private async checkWritePermissionsSilent(chats: Chat[]): Promise<ChatWithPermission[]> {
        const results: ChatWithPermission[] = [];
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            let canSend = false;
            let reason = '';

            try {
                const entity = await this.client.getInputEntity(chat.id!);
                if (entity instanceof Api.InputPeerChannel) {
                    const result = await this.client.invoke(
                        new Api.channels.GetParticipant({
                            channel: entity,
                            participant: 'me'
                        })
                    );
                    const participant = result.participant;
                    if (participant instanceof Api.ChannelParticipantBanned) {
                        canSend = false;
                        reason = 'Banned from channel';
                    } else {
                        canSend = true;
                    }
                } else {
                    canSend = true; // не канал — считаем, что можно (в вашем случае таких нет)
                }
            } catch (e: any) {
                canSend = false;
                reason = e.message || 'Not a member or chat unavailable';
            }

            results.push({ id: chat.chat_id!, title: chat.title!, canSend, reason: canSend ? undefined : reason });

            // Задержка для избежания флуда
            if (i % 20 === 19) await this.sleep(1000);
        }
        return results;
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async execute(dateTime: Date, scheduleId: number, messages: Message[], chats: Chat[]) {
        try {
            if (!this.client.connected) {
                await this.client.connect();
            }

            const accessibleChats = await this.getAccessibleChatsSilent(chats);

            if (accessibleChats.length === 0) {
                console.log('❌ Нет доступных чатов для рассылки');
                await db.sendout.setActive(this.sendout.id!, false); 
                return;
            }

            const counter = { good: 0, chats: [] };
            const message = this.selectMessage(messages, scheduleId);

            for (let i = 0; i < accessibleChats.length; i++) {
                const chat = accessibleChats[i];

                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 400));
                }

                await this.sender.send(chat, message, counter);
            }
            
            await this.logResults(dateTime, counter);
            console.log(`Рассылка завершена! Успешно: ${counter.good} из ${accessibleChats.length}\n`);
            await db.sendout.setActive(this.sendout.id!, false); 
        } catch (error) {
            console.error('💀 Ошибка выполнения рассылки:', error);
        }
    }

    private selectMessage(messages: Message[], scheduleId: number): Message {
        if (messages.length === 1) return messages[0]!;
        if (messages.length === 2) {
            const day = new Date().getDay();
            return [1, 3, 5, 7].includes(day) ? messages[0]! : messages[1]!;
        }
        return messages[scheduleId] || messages[0]!;
    }

    private async logResults(dateTime: Date, counter: Counter) {
        await utils.log("db", {
            date_time: dateTime,
            success: counter.good,
            chats: counter.chats,
            sendout_id: this.sendout.id
        });
    }
}