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
        addingText: boolean;
        updatingText: boolean;
        generatingText: boolean;
        addingMedia: boolean;
        addingTime: boolean;
        updatingTime: boolean;
        addingIdea: boolean;
    };
    other: {
        ids: {
            idForUpdateMessageFromState: number;
            commandCabinetId: number;
        };
        text: {
            generateText: string;
            generateEntities: any[];
            positionId: number;
        };
        media: {
            positionId: number;
        };
        time: {
            positionId: number;
        };
        message: {
            positionId: number;
        }
    }
}

export interface I18nFlavor {
    t: (key: string, options?: Record<string, any>) => string;
}

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;