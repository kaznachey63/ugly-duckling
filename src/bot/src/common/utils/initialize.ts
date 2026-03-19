import db from '@shared/db';
import type { SessionData } from '@shared/types/SessionData';
import { type BotCommand, type LanguageCode } from 'grammy/types';
import i18next from 'i18next';
import { sleep } from 'telegram/Helpers';

function createDefaultSession(): SessionData {
    return {
        settings: {
            languageCode: 'auto',
        },
        user: {
            id: 0,
            role: 'unknown',
            phoneNumber: "",
        },
        distribution: {
            call: "",
            label: "",
            name: "",
            schema: "",
        },
        state: {
            ids: {
                idForUpdateMessageFromState: 0,
                commandCabinetId: 0,
            },
            text: {
                adding: false,
                updating: false,
                generating: false,
                generateText: "",
                generateEntities: [],
                positionId: 0,
            },
            media: {
                adding: false,
                positionId: 0,
            },
            time: {
                adding: false,
                updating: false,
                positionId: 0,
            },
        },
    }
}

// надо постоянно при кабинете и коллбеке вызывать
async function setupBotCommands(bot: any) {
    await bot.api.deleteMyCommands({ scope: { type: 'all_private_chats' } });
    const languages: LanguageCode[] = ['ru', 'en', 'zh'];

    for (const lang of languages) {
        const baseCommands = getCommandsForLanguage(lang);

        // отображение комманд для всех
        await bot.api.setMyCommands(baseCommands, {
            language_code: lang,
            scope: { type: "all_private_chats" }
        });

        // отображение комманд для заказчиков (без заявки)
        const customerCommands = baseCommands.filter((cmd) => cmd.command !== 'panel');
        const customers = (await db.user.getUsers()).customers;

        for (const customerId of customers) {
            await bot.api.setMyCommands(customerCommands, {
                language_code: lang,
                scope: {
                    type: "chat",
                    chat_id: customerId
                }
            });
            await sleep(50);
        }

        // отображение комманд для админов (с заявкой и панелью)
        const adminCommands = [...baseCommands, {
            command: 'panel',
            description: i18next.t('utils.commands.panel', { lng: lang })
        }];
        const admins = (await db.user.getUsers()).admins;

        for (const adminId of admins) {
            await bot.api.setMyCommands(adminCommands, {
                language_code: lang,
                scope: {
                    type: "chat",
                    chat_id: adminId
                }
            });
            await sleep(50);
        }
    }
}

function getCommandsForLanguage(lang: LanguageCode): BotCommand[] {
    return [
        { command: 'cabinet', description: i18next.t('utils.commands.cabinet', { lng: lang }) },
        { command: 'settings', description: i18next.t('utils.commands.settings', { lng: lang }) },
        { command: 'form', description: i18next.t('utils.commands.form', { lng: lang }) }
    ];
}

export default {
    createDefaultSession,
    setupBotCommands    
}