import { Context, type SessionFlavor } from "grammy";
import type { Role } from '@shared/types/Role';
import type { LanguageCode } from '@shared/types/LanguageCode';

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