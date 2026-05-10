import type { SessionData } from '@shared/types/SessionData';

function createDefaultSession(): SessionData {
    return {
        isAdmin: false,
        user: {
            id: 0,
            role_id: 0,
            telegram_id: BigInt(0),
            language: 'ru',
            name: "",
            phone: "",
            username: "",
            role: {
                id: 0,
                code: "unknown"
            }
        },
        generate: {
            text: "",
            entities: []
        },
        sendout: {
            call: "",
            contract_id: 0,
            credential_id: 0,
            id: 0,
            label: "",
            name: "",
            user_id: 0,
            active: false
        },
        message: {
            caption: "",
            entities: [],
            sendout_id: 0,
            position: 0,
            id: 0,
            media: [],
            sendout: {
                call: "",
                contract_id: 0,
                credential_id: 0,
                telegram_topic_id: 0,
                id: 0,
                label: "",
                name: "",
                user_id: 0,
                active: false,
            }
        },
        schedule: {
            cron: "",
            label: "",
            id: 0,
            position: 0,
            sendout_id: 0,
            sendout: {
                call: "",
                telegram_topic_id: 0,
                contract_id: 0,
                credential_id: 0,
                id: 0,
                label: "",
                name: "",
                user_id: 0,
                active: false
            }
        },
        contract: {
            date_end: new Date(),
            date_start: new Date(),
            price: 0,
            price_text: "",
            id: 0,
            user_id: 0,
            user: {
                telegram_id: BigInt(0),
                language: 'ru',
                name: "",
                phone: "",
                username: "",
                role: {
                    id: 0,
                    code: "unknown"
                },
                id: 0,
                role_id: 0
            }
        },
        result: {
            id: 0,
            date_time: new Date(),
            sendout_id: 0,
            chats: [],
            success: 0,
        },
        state: {
            addingText: false,
            updatingText: false,
            generatingText: false,
            addingMedia: false,
            addingTime: false,
            updatingTime: false,
            addingIdea: false,
            addingUser: false,
            passingAuthorization: false,
            addingContract: false
        },
        server: {
            processName: "",
            processType: "none",
            logPage: 0,
            logSort: "old"
        },
        other: {
            ids: {
                idForUpdateMessageFromState: 0,
                commandCabinetId: 0,
            }
        }
    }
}

export default {
    createDefaultSession
}