import type { SessionData } from '@shared/types/SessionData';

function createDefaultSession(): SessionData {
    return {
        settings: {
            languageCode: 'ru',
        },
        user: {
            id: 0,
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
            commandId: 0,
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

export default {
    createDefaultSession,
}