import { Context, type SessionFlavor } from "grammy";
import type { Role } from '@shared/types/Role';
import type { LanguageCode } from "grammy/types";

export interface SessionData {
    settings: {
        languageCode: LanguageCode | 'auto';
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
        ids: {
            idForUpdateMessageFromState: number;
            commandId: number;
        };
        text: {
            adding: boolean;
            updating: boolean;
            positionId: number;
        };
        media: {
            adding: boolean;
            positionId: number;
        };
        time: {
            adding: boolean;
            updating: boolean;
            positionId: number;
        };
    };
}

export interface I18nFlavor {
    t: (key: string, options?: Record<string, any>) => string;
}

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;