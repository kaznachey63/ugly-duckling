import { Context, type SessionFlavor } from "grammy";
type LanguageCode =  "ru" | "en";
type Role = "admin" | "customer" | "unkown";

export interface SessionData {
    settings: {
        languageCode: LanguageCode;
    };
    user: {
        id: number;
        role: Role;
        phoneNumber: string;
    };
    distribution: {
        call: string;
        label: string;
        name: string;
        schema: string;
    };
    state: {
        idForUpdateMessageFromState: number;
        commandId: number;
        text: {
            adding: boolean;
            updating: boolean;
            paginationId: number;
        };
        media: {
            adding: boolean;
            paginationId: number;
        };
        time: {
            adding: boolean;
            updating: boolean;
            paginationId: number;
        };
    };
}

export interface I18nFlavor {
    t: (key: string, options?: Record<string, any>) => string;
}

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;