import type { MyContext, SessionData } from '@shared/types/SessionData';
import db from "@shared/db";
import type { Role } from '@shared/types/Role';

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
}

async function setPrimaryValuesSession(ctx: MyContext) {
    // Присваивание инфо о рассылке и пользователе
    ctx.session.user = ctx.session.user.phone ? (await db.user.getUser(ctx.session.user.phone, false))! : (await db.user.getUser(ctx.from?.id!, true))!;
    const nameDistribution = ctx?.callbackQuery?.data?.split(/:/)[1]?.split(/#/)[0]!;
    const infoDist = await db.sendout.getSendoutInfo(nameDistribution);
    if (infoDist) {
        ctx.session.sendout = {
            name: nameDistribution,
            call: infoDist.call,
            label: infoDist.label, 
            schema: infoDist.schema
        }
    }
}

function isAdmin(role: Role): boolean { return role.nameEn == "admin" };

export default {
    resetSessionStates,
    setPrimaryValuesSession,
    isAdmin
};