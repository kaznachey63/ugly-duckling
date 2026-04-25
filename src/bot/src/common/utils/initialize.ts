import constants from '@constants';
import db from '@shared/db';
import type { LanguagesALlowed } from '@shared/types/LanguagesAllowed';
import type { SessionData } from '@shared/types/SessionData';
import { type BotCommand, type LanguageCode } from 'grammy/types';
import i18next from 'i18next';
import { sleep } from 'telegram/Helpers';

function createDefaultSession(): SessionData {
    return {
        isAdmin: false,
        user: {
            telegramId: BigInt(0),
            language: 'ru',
            name: "",
            phone: "",
            username: "",
            role: {
                code: "unknown"
            }
        },
        sendout: {
            call: "",
            label: "",
            name: "",
            schema: "",
        },
        state: {
            addingText: false,
            updatingText: false,
            generatingText: false,
            addingMedia: false,
            addingTime: false,
            updatingTime: false,
            addingIdea: false,
            addingUser: false,
        },
        other: {
            ids: {
                idForUpdateMessageFromState: 0,
                commandCabinetId: 0,
            },
            text: {

                generateText: "",
                generateEntities: [],
                positionId: 0,
            },
            media: {
                positionId: 0,
            },
            time: {
                positionId: 0,
            },
            message: {
                positionId: 0
            }
        }
    }
}

// надо постоянно при кабинете и коллбеке вызывать
async function setupBotCommands(bot: any) {
    await bot.api.deleteMyCommands({ scope: { type: 'all_private_chats' } });
    const languages: LanguagesALlowed[] = constants.allowLanguages;

    for (const lang of languages) {
        const baseCommands = getCommandsForLanguage(lang);

        // отображение комманд для всех
        await bot.api.setMyCommands(baseCommands, {
            language_code: lang,
            scope: { type: "all_private_chats" }
        });

        // отображение комманд для админов (с панелью)
        const adminCommands = [...baseCommands, {
            command: 'panel',
            description: i18next.t('utils.commands.panel', { lng: lang })
        }];
        const admins = (await db.user.getGroupsOfUsers()).admins;

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
    ];
}

export default {
    createDefaultSession,
    setupBotCommands    
}