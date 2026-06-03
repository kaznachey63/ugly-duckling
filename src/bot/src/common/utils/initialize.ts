import constants from '@common/constants';
import type { MyContext, SessionData } from '@shared/types/SessionData';

/**
 * Создание базовой (пустой) сессии
 */
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
        userForUpdate: {
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
            mode_active: false,
            mode_test: false,
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
                mode_active: false,
                mode_test: false,
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
                mode_active: false,
                mode_test: false,
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
                role_id: 0,
                phone_index: ""
            }
        },
        authLimit: {
            blocked_until: null,
            failed_attempts: 0,
            id: 0,
            telegram_id: BigInt(0),
            last_attempt_at: null
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
            addingContract: false,
            updatingSendoutCall: false,
            updatingUserName: false,
            updatingUserPhone: false,
        },
        server: {
            processName: "",
            processType: "none",
            logPage: 0,
            logSort: "old"
        },
        other: {
            ids: {
                cash: [],
                idForUpdateMessageFromState: 0,
                commandCabinetId: 0,
            },
        }
    }
}

/**
 * Ограничение использования команд
 */
function rateLimitCommands(ctx: MyContext, commandCooldowns: Map<number, number>): boolean {
    const userId = ctx.from?.id!;
    const now = Date.now();
    const last = commandCooldowns.get(userId) || 0;
    if (now - last < constants.limit.commandsTime) return false;
    commandCooldowns.set(userId, now);
    return true;
}

/**
 * Ограничение нажатия на кнопку
 */
function lockCallback(ctx: MyContext, callbackLocks: Set<number>): boolean {
    const userId = ctx.from?.id!;
    if (callbackLocks.has(userId)) return false;
    callbackLocks.add(userId);
    return true;
}

/**
 * Снятие ограничения коллбека прожатой кнопки
 */
function unlockCallback(ctx: MyContext, callbackLocks: Set<number>) {
    callbackLocks.delete(ctx.from?.id!);
}

export default {
    createDefaultSession,
    rateLimitCommands,
    lockCallback,
    unlockCallback
}