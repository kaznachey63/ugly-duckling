import type { SessionData } from '@shared/types/SessionData';
import { Calendar } from 'telegram-inline-calendar';

function createDefaultSession(): SessionData {
    return {
        settings: {
            languageCode: 'ru',
        },
        user: {
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

function initCalendar(bot: any): Calendar {
    return new Calendar(bot, {
        language: "ru",
        date_format: "DD-MM-YYYY"
    });
}

export default {
    createDefaultSession,
    initCalendar
}