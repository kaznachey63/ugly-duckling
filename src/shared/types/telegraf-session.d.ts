// types/session.d.ts
import { Session } from 'grammy';

export interface MySession extends Session {
    busy: boolean;
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
        text: { 
            id: number 
        };
        media: { 
            id: number 
        };
        time: {
            id: number
        }
    };
    state: {
        text: { 
            addingText: boolean; 
            updatingText: boolean 
        };
        media: { 
            addingMedia: boolean; 
            editinigMedia: boolean 
        };
        time: {
            addingTime: boolean;
            editinigTime: boolean
        },
        busy: boolean;
        skipProcessingToast: boolean;
    };
    mediaBuffer: {
        timer: any,
        items: number
    };
    messages: number[];
    distribution: {
        name: string;
        label: string;
        call: string;
        schema: string;
    }
}

declare module 'grammy' {
    interface Context {
        session: MySession;
    }
}