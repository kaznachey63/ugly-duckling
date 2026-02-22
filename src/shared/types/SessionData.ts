import type { Context, SessionFlavor } from "grammy";

export interface SessionData {
    busy: boolean;
    languageCode: string;
    role: string;
    phoneNumber: string;
    nameRas: string;
    nameRus: string;
    messageIds: {
        start: number;
        welcomeText: number;
        sendNumber: number;
        processText: number;
        forTextOrMedia: number;
        forTime: number;
    };
    typePartition: {
        text: { id: number };
        media: { id: number };
        time: { id: number };
    };
    state: {
        text: {
            addingText: boolean;
            editingText: boolean;
        };
        media: {
            addingMedia: boolean;
            editingMedia: boolean;
        };
        time: {
            addingTime: boolean;
            editingTime: boolean;
        };
        busy: boolean;
        skipProcessingToast: boolean;
    };
    mediaBuffer: {
        timer: NodeJS.Timeout | undefined;
        items: number;
    };
    messages: string[];
    distribution: {
        call: string;
        label: string;
        name: string;
        schema: string;
    };
}

// 👇 Добавляем интерфейс для i18n
export interface I18nFlavor {
    t: (key: string, options?: Record<string, any>) => string;
}

// 👇 Включаем его в MyContext
export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;