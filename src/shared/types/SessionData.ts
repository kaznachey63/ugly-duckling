import { Context, type SessionFlavor } from "grammy";
import type { User } from "./User";
import type { Sendout } from "./Sendout";

export interface SessionData {
    isAdmin: boolean;
    user: User;
    sendout: Sendout;
    state: {
        addingText: boolean;
        updatingText: boolean;
        generatingText: boolean;
        addingMedia: boolean;
        addingTime: boolean;
        updatingTime: boolean;
        addingIdea: boolean;
        addingUser: boolean;
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
        };
    }
}

export interface I18nFlavor {
    t: (key: string, options?: Record<string, any>) => string;
}

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;