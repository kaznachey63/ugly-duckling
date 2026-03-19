import type { Role } from '@shared/types/Role';
import type { SessionData } from '@shared/types/SessionData';
import { admin } from 'googleapis/build/src/apis/admin';
import { type BotCommand, type LanguageCode } from 'grammy/types';
import i18next from 'i18next';

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
        const commands = getCommandsForLanguage(lang);
        await bot.api.setMyCommands(commands, { language_code: lang });
        await bot.api.setMyCommands(commands, { language_code: lang, scope: {
            type: "chat", chat_id: "809015177"
        }});
    }
}

function getCommandsForLanguage(lang: LanguageCode): BotCommand[] {
    return [
        { command: 'cabinet', description: i18next.t('utils.commands.cabinet', { lng: lang }) },
        { command: 'settings', description: i18next.t('utils.commands.settings', { lng: lang }) },
        { command: 'form', description: i18next.t('utils.commands.form', { lng: lang }) },
    ];
}

export default {
    createDefaultSession,
    setupBotCommands    
}