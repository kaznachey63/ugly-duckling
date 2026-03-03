import type { MyContext, SessionData } from '@shared/types/SessionData';
import type { Bot } from 'grammy';
import type { BotCommand, LanguageCode } from 'grammy/types';

function createDefaultSession(): SessionData {
    return {
        settings: {
            languageCode: 'ru',
        },
        user: {
            id: 0,
            role: 'unkown',
            phoneNumber: "",
        },
        distribution: {
            call: "",
            label: "",
            name: "",
            schema: "",
        },
        state: {
            idForUpdateMessageFromState: 0,
            commandId: 0,
            text: {
                adding: false,
                updating: false,
                paginationId: 0,
            },
            media: {
                adding: false,
                paginationId: 0,
            },
            time: {
                adding: false,
                updating: false,
                paginationId: 0,
            },
        },
    }
};

async function setupBotCommands(bot: any) {
    await bot.api.deleteMyCommands({ scope: { type: 'all_private_chats' } });

    const map: Record<string, BotCommand[]> = {
        ru: [
            { command: 'cabinet', description: 'Личный кабинет' },
            { command: 'settings', description: 'Настройки' },
            { command: 'form', description: 'Анкета' },
        ],
        en: [
            { command: 'cabinet', description: 'Personal account' },
            { command: 'settings', description: 'Settings' },
            { command: 'form', description: 'Form' },
        ],
    }

    for (const [lang, commands] of Object.entries(map)) {
        try {
            await bot.api.setMyCommands(commands, { language_code: lang as LanguageCode});
            console.log(`✅ Commands set for ${lang}`);
        } catch (error) {
            console.error(`❌ Failed to set commands for ${lang}:`, error);
        }
    }
}

export default {
    createDefaultSession,
    setupBotCommands    
}