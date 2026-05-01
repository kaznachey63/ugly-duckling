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
            telegram_id: BigInt(0),
            language: 'ru',
            name: "",
            phone: "",
            username: "",
            role: {
                id: 0,
                code: "unknown"
            }
        },
        generate: {
            text: "",
            entities: []
        },
        sendout: {
            call: "",
            contract_id: 0,
            credential_id: 0,
            execution_id: 0,
            id: 0,
            label: "",
            name: "",
            status: {
                code: "",
                id: 0
            },
            user_id: 0,
            execution: {
                code: "",
                id: 0
            },
            status_id: 0
        },
        message: {
            caption: "",
            entities: [],
            sendout_id: 0,
            position: 0,
            id: 0,
            media: [],
            sendout: {
                call: "",
                contract_id: 0,
                credential_id: 0,
                execution_id: 0,
                id: 0,
                label: "",
                name: "",
                status: {
                    code: "",
                    id: 0
                },
                user_id: 0,
                execution: {
                    code: "",
                    id: 0
                },
                status_id: 0
            }
        },
        schedule: {
            cron: "",
            label: "",
            id: 0,
            position: 0,
            sendout_id: 0,
            sendout: {
                call: "",
                contract_id: 0,
                credential_id: 0,
                execution_id: 0,
                id: 0,
                label: "",
                name: "",
                status: {
                    code: "",
                    id: 0
                },
                user_id: 0,
                execution: {
                    code: "",
                    id: 0
                },
                status_id: 0
            }
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
            passingAuthorization: false,
            addingContract: false
        },
        other: {
            ids: {
                idForUpdateMessageFromState: 0,
                commandCabinetId: 0,
            }
        }
    }
}

// надо постоянно при кабинете и коллбеке вызывать
async function setupBotCommands(bot: any) { // убрать
    // return;
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
    createDefaultSession
}