import type { MyContext, SessionData } from '@shared/types/SessionData';
import db from "@shared/db";
import constants from '@constants';

/**
 * Сброс сессии
 * @param session Сессия
 */
function resetSessionStates(session: SessionData) {
    session.state.addingText = false;
    session.state.updatingText = false;
    session.state.generatingText = false;
    session.state.addingTime = false;
    session.state.updatingTime = false;
    session.state.addingMedia = false;
    session.other.text.positionId = 0;
    session.other.media.positionId = 0;
    session.state.addingIdea = false;
    session.state.addingUser = false;
    session.state.passingAuthorization = false;
}

async function setPrimaryValuesSession(ctx: MyContext) {
    // Присваивание инфо о рассылке и пользователе
    if (await db.user.existsInDB(BigInt(ctx.from?.id!))) {
        ctx.session.user = ctx.session.user.phone ? (await db.user.getUser(ctx.session.user.phone))! : (await db.user.getUser(BigInt(ctx.from?.id!)))!;
    }
    else {
        ctx.session.user.role.code = 'unknown';
    }
    ctx.session.isAdmin = ctx.session.user?.role.code === "admin";

    const sendoutName = ctx?.callbackQuery?.data?.split(/:/)[1]?.split(/#/)[0]!;
    const infoDist = await db.sendout.getSendoutInfo(sendoutName);
    if (infoDist) {
        ctx.session.sendout = {
            name: sendoutName,
            call: infoDist.call,
            label: infoDist.label, 
            schema: infoDist.schema
        }
    }
}

/**
 * Удаление сообщений при авторизации
 */
async function deleteMessageProcessing(ctx: MyContext, endMsgId?: number) {
    try {
        const commandId = ctx.session.other.ids.commandCabinetId;
        const targetEndId = endMsgId || ctx.msgId;
        
        // Проверки: если нет данных — выходим
        if (!commandId || !targetEndId || !ctx.chat?.id) return;

        let count = 0;
        const maxIterations = 100;

        while (commandId <= targetEndId - count) {
            if (count > maxIterations) break;

            const targetId = targetEndId - count;
            if (!targetId) break;

            try {
                await ctx.api.deleteMessage(ctx.chat.id, targetId);
            } catch { }

            count += 1;
        }
    } catch { }
}

function isAdminPhone(phone: string) {
    return phone === constants.adminData.phone;
}

export default {
    resetSessionStates,
    setPrimaryValuesSession,
    isAdminPhone,
    deleteMessageProcessing
};