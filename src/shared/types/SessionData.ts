import { Context, type SessionFlavor } from "grammy";
import type { User, Sendout, Schedule, Message, Result, Contract } from "@shared/types/DB";
import type { ProcessType } from "./ProcessType";

export interface SessionData {
    isAdmin: boolean;
    user: User;
    sendout: Sendout;
    schedule: Schedule;
    message: Message;
    result: Result;
    contract: Contract;
    generate: {
        text: string;
        entities: any[];
    };
    state: {
        addingText: boolean;
        updatingText: boolean;
        generatingText: boolean;
        addingMedia: boolean;
        addingTime: boolean;
        updatingTime: boolean;
        addingIdea: boolean;
        addingUser: boolean;
        passingAuthorization: boolean;
        addingContract: boolean;

    };
    server: {
        processType: ProcessType;
        processName: string;
    };
    other: {
        ids: {
            idForUpdateMessageFromState: number;
            commandCabinetId: number;
        };
    }
}

export interface I18nFlavor {
    t: (key: string, options?: Record<string, any>) => string;
}

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;