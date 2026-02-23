import type { MyContext, SessionData } from '@shared/types/SessionData';
import type { Bot, Context, SessionFlavor } from 'grammy';
import { Calendar } from 'telegram-inline-calendar';

function createDefaultSession(): SessionData {
    return {
        busy: false,
        languageCode: "ru",
        role: "",
        phoneNumber: "",
        nameRas: "",
        nameRus: "",

        messageIds: {
            start: 0,
            welcomeText: 0,
            sendNumber: 0,
            processText: 0,
            forTextOrMedia: 0,
            forTime: 0
        },

        typePartition: {
            text: { id: 0 },
            media: { id: 0 },
            time: { id: 0 }
        },

        state: {
            text: {
                addingText: false,
                editingText: false
            },
            media: {
                addingMedia: false,
                editingMedia: false
            },
            time: {
                addingTime: false,
                editingTime: false
            },
            busy: false,
            skipProcessingToast: false
        },

        mediaBuffer: {
            timer: undefined,
            items: 0
        },

        messages: [],
        distribution: {
            call: "",
            label: "",
            name: "",
            schema: ""
        }
    };
};

// type MyMyContext = MyContext & SessionFlavor<SessionData>;
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