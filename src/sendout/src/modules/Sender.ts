import type { Counter } from '@shared/types/Counter';
import type { Chat, Media, Message } from '@shared/types/DB';
import utils from '../utils';
import fs from 'fs/promises';
import path from 'path';
import { TelegramClient } from 'telegram';
import type { JsonArray } from '@shared/db/prisma/internal/prismaNamespace';

export class Sender {
    constructor(private readonly client: TelegramClient) { }

    async send(chat: Chat, message: Message, counter: Counter) {
        const { id: chatId, title: chatName } = chat;
        try {
            // Получаем правильный объект сущности (InputPeer)
            const entity = await this.client.getInputEntity(chatId!);

            const htmlCaption = this.entitiesToHtml(message.caption!, message.entities as unknown as JsonArray || []);
            let result;
            if (message.media?.length) {
                // Передаём entity, а не строку
                result = await this.sendMedia(entity, message, htmlCaption);                
            } else {
                result = await this.client.sendMessage(entity, {
                    message: htmlCaption,
                    parseMode: 'html',
                });
            }

            let isSuccess = false;
            let details = '';

            if (result) {
                if (Array.isArray(result)) {
                    // Медиагруппа (даже из одного файла)
                    isSuccess = result.length > 0;
                    details = `медиагруппа (${result.length} элементов)`;
                } else if (result.id) {
                    // Одиночное сообщение
                    isSuccess = true;
                    details = `сообщение id: ${result.id}`;
                } else {
                    details = `неизвестный тип результата: ${typeof result}`;
                }
            } else {
                details = 'пустой результат';
            }

            if (isSuccess) {
                counter.good++;
                counter.chats.push(chatId);
                console.log(`✅ Успешно: "${chatName}" (${chatId}) — ${details} | Счётчик: ${counter.good}`);
            } else {
                console.log(`⚠️  Нет подтверждения: "${chatName}" (${chatId}) — ${details} | Счётчик: ${counter.good}`);
            }
        } catch (error: any) {
            // 👇 ВРЕМЕННЫЙ ДЕБАГ-ЛОГ
            console.error(`[DEBUG ERROR] Chat: ${chatId}`, {
                message: error.message,
                code: error.code,
                errorMessage: error.errorMessage,
                stack: error.stack?.substring(0, 300)
            });

            const reason = utils.error.errorSmsHandler(error);
            console.log(`❌ Неудачно: "${chatName}" (${chatId}) — ${reason} | Счётчик: ${counter.good}`);
        }
    }

    private async sendMedia(entity: any, message: Message, htmlCaption: string) {
        const files = await this.prepareMedia(message.media!);
        
        // Используем entity вместо chatId
        return await this.client.sendFile(entity, {
            file: files,
            caption: htmlCaption,
            parseMode: 'html',
        });
    }
    
    /**
     * Подготовка файлов
     */
    private async prepareMedia(mediaItems: Media[]): Promise<string[]> {
        const files: string[] = [];
        for (const item of mediaItems) {
            const filePath = path.resolve('resources', item.name!);
            await fs.access(filePath);
            files.push(filePath);
        }
        return files;
    }

    /**
     * 🔥 Преобразование Telegram entities в HTML с корректной вложенностью.
     * Поддерживает: bold, italic, underline, mention, text_link.
     * Хэштеги оставляет как есть (Telegram сам их подсветит).
     */
    private entitiesToHtml(text: string, entities: any[]): string {
        if (!entities.length) return this.escapeHtml(text);

        // Сортируем сущности по offset, при равных offset — сначала те, что длиннее
        const sorted = [...entities].sort((a, b) => {
            if (a.offset !== b.offset) return a.offset - b.offset;
            return b.length - a.length;
        });

        const stack: { tag: string; closeTag: string; entity: any }[] = [];
        let html = '';
        let pos = 0;

        for (const entity of sorted) {
            const { offset, length, type, url } = entity;

            // Закрываем сущности, которые закончились до текущего offset
            while (stack.length && stack[stack.length - 1].entity.offset + stack[stack.length - 1].entity.length <= offset) {
                const last = stack.pop()!;
                html += this.escapeHtml(text.slice(pos, last.entity.offset + last.entity.length)) + last.closeTag;
                pos = last.entity.offset + last.entity.length;
            }

            // Текст от текущей позиции до начала entity
            if (pos < offset) {
                html += this.escapeHtml(text.slice(pos, offset));
                pos = offset;
            }

            // Открываем новую сущность
            const tagInfo = this.getTagInfo(entity, text);
            if (tagInfo) {
                stack.push(tagInfo);
                html += tagInfo.tag;
            }
        }

        // Закрываем оставшиеся в стеке сущности
        while (stack.length) {
            const last = stack.pop()!;
            html += this.escapeHtml(text.slice(pos, last.entity.offset + last.entity.length)) + last.closeTag;
            pos = last.entity.offset + last.entity.length;
        }

        // Остаток текста после последней сущности
        if (pos < text.length) {
            html += this.escapeHtml(text.slice(pos));
        }

        return html;
    }

    /**
     * Возвращает HTML-теги для сущности или null (например, для hashtag).
     */
    private getTagInfo(entity: any, fullText: string): { tag: string; closeTag: string; entity: any } | null {
        const { type, offset, length, url } = entity;
        const fragment = fullText.slice(offset, offset + length);

        switch (type) {
            case 'bold':
                return { tag: '<b>', closeTag: '</b>', entity };
            case 'italic':
                return { tag: '<i>', closeTag: '</i>', entity };
            case 'underline':
                return { tag: '<u>', closeTag: '</u>', entity };
            case 'mention': {
                const username = fragment.slice(1); // убираем @
                const href = `https://t.me/${this.escapeHtml(username)}`;
                return { tag: `<a href="${href}">`, closeTag: '</a>', entity };
            }
            case 'text_link':
                return { tag: `<a href="${this.escapeHtml(url)}">`, closeTag: '</a>', entity };
            case 'hashtag':
                // Не трогаем — Telegram сам делает ссылкой
                return null;
            default:
                return null;
        }
    }

    /**
     * Экранирование HTML-спецсимволов
     */
    private escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
 * 🔍 Анализ ошибки и формирование понятного сообщения
 */
    private analyzeError(error: any): {
        message: string;
        type: string;
        suggestion: string;
        details?: string;
    } {
        const errorMsg = error.message || '';
        const errorCode = error.code || error.errorMessage;

        // 📋 Классификация ошибок
        if (errorCode === 'CHANNEL_INVALID' || errorMsg.includes('CHANNEL_INVALID')) {
            return {
                message: 'CHANNEL_INVALID — канал/группа недоступна',
                type: 'Доступ запрещён',
                suggestion: 'Подпишитесь на канал или добавьтесь в группу вручную',
                details: 'Аккаунт не состоит в чате, забанен или чат удалён'
            };
        }

        if (errorMsg.includes('Could not find the input entity')) {
            return {
                message: 'Сущность не найдена в кэше',
                type: 'Кэш сущностей',
                suggestion: 'Добавьтесь в чат вручную, затем перезапустите скрипт',
                details: 'GramJS не может разрешить chat_id без предварительного взаимодействия'
            };
        }

        if (errorCode === 'CHAT_WRITE_FORBIDDEN' || errorMsg.includes('CHAT_WRITE_FORBIDDEN')) {
            return {
                message: 'Запрещено писать в чат',
                type: 'Права записи',
                suggestion: 'Проверьте, не забанен ли аккаунт; для каналов нужна роль администратора',
                details: 'У аккаунта нет прав на отправку сообщений'
            };
        }

        if (errorCode === 'USER_BANNED_IN_CHANNEL' || errorMsg.includes('USER_BANNED_IN_CHANNEL')) {
            return {
                message: 'Аккаунт забанен в канале',
                type: 'Бан',
                suggestion: 'Обратитесь к администратору канала для разбана',
                details: 'Отправка невозможна пока аккаунт в чёрном списке'
            };
        }

        if (errorCode === 'FLOOD_WAIT' || errorMsg.includes('FLOOD_WAIT')) {
            const waitMatch = errorMsg.match(/FLOOD_WAIT_(\d+)/);
            const seconds = waitMatch ? waitMatch[1] : 'неизвестно';
            return {
                message: `FLOOD_WAIT — лимит отправки превышен`,
                type: 'Спам-защита Telegram',
                suggestion: `Подождите ${seconds} секунд перед следующей отправкой`,
                details: `Telegram временно блокирует отправку из-за частых запросов`
            };
        }

        if (errorMsg.includes('Connection') || errorMsg.includes('timeout')) {
            return {
                message: 'Проблема с подключением к Telegram',
                type: 'Сетевая ошибка',
                suggestion: 'Проверьте интернет-соединение и перезапустите скрипт',
                details: errorMsg
            };
        }

        // 🎯 Общая ошибка
        return {
            message: utils.error.errorSmsHandler(error) || 'Неизвестная ошибка',
            type: 'Неизвестная ошибка',
            suggestion: 'Проверьте логи и попробуйте снова',
            details: errorMsg.substring(0, 200)
        };
    }
}