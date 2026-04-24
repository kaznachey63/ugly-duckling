import type { MyContext, SessionData } from '@shared/types/SessionData';
import db from "@shared/db";

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
}

async function setPrimaryValuesSession(ctx: MyContext) {
    // Присваивание инфо о рассылке и пользователе
    ctx.session.user = ctx.session.user.phone ? (await db.user.getUser(ctx.session.user.phone))! : (await db.user.getUser(BigInt(ctx.from?.id!)))!;
    console.log(ctx.session.user);
    
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

function isAdmin(ctx: MyContext): boolean { return ctx.session.user.role == "admin" };

export default {
    resetSessionStates,
    setPrimaryValuesSession,
    isAdmin
};